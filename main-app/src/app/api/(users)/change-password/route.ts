import crypto from "node:crypto";
import { hashPassword, verifyPassword } from "@/helpers/hash-password";
import { requireAuth } from "@/lib/auth/auth-middleware";
import dbConnect from "@/lib/config/db-connect";
import { handleApiError } from "@/lib/utils/error-handler";
import { logApiError } from "@/lib/utils/logger";
import {
  sendAppError,
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} from "@/lib/utils/response";
import { validateAndSanitize } from "@/lib/utils/validators";
import { UserAuthModel } from "@/models/users";
import { changePasswordSchema, setPasswordSchema } from "@/zod/usersUpdate";
import type { NextRequest } from "next/server";

/**
 * POST /api/(users)/change-password
 * Change or set user password
 * @param request - NextRequest with authorization header and password data in body
 * @returns Password change confirmation
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Find user auth
    const userAuth = await UserAuthModel.findById(authResult.user?.userId);
    if (!userAuth) {
      return sendNotFound("User not found", requestId);
    }

    // Determine validation schema based on existing password
    const hasExistingPassword = Boolean(userAuth.password);
    const validationSchema = hasExistingPassword
      ? changePasswordSchema
      : setPasswordSchema;

    // Validate input
    validateAndSanitize(
      { currentPassword, newPassword, confirmPassword },
      validationSchema,
    );

    // Verify passwords match
    if (newPassword !== confirmPassword) {
      return sendBadRequest("Passwords do not match", undefined, requestId);
    }

    // If user has existing password, verify current password
    if (hasExistingPassword) {
      if (!currentPassword || !userAuth.password) {
        return sendBadRequest(
          "Current password is required",
          undefined,
          requestId,
        );
      }

      const isCurrentPasswordValid = await verifyPassword(
        currentPassword,
        userAuth.password,
      );
      if (!isCurrentPasswordValid) {
        return sendBadRequest(
          "Current password is incorrect",
          undefined,
          requestId,
        );
      }

      const isSamePassword = await verifyPassword(
        newPassword,
        userAuth.password,
      );
      if (isSamePassword) {
        return sendBadRequest(
          "New password must be different from current password",
          undefined,
          requestId,
        );
      }
    }

    // Hash and update password
    const hashedNewPassword = await hashPassword(newPassword);
    userAuth.password = hashedNewPassword;
    userAuth.updatedAt = new Date();
    await userAuth.save();

    const message = hasExistingPassword
      ? "Your password has been updated successfully"
      : "Password added successfully. You can now sign in with email too.";

    return sendSuccess("Password changed successfully", { message }, requestId);
  } catch (error) {
    logApiError("/api/change-password", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/change-password",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}
