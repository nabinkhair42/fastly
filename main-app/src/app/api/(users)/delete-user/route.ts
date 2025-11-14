import crypto from "node:crypto";
import { verifyPassword } from "@/helpers/hash-password";
import { requireAuth } from "@/lib/auth/auth-middleware";
import { handleApiError } from "@/lib/utils/error-handler";
import { logApiError, logAuthEvent } from "@/lib/utils/logger";
import {
  sendAppError,
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} from "@/lib/utils/response";
import { validateAndSanitize } from "@/lib/utils/validators";
import { UserSessionModel } from "@/models/user-sessions";
import { UserAuthModel, UserModel } from "@/models/users";
import { deleteUserSchema } from "@/zod/usersUpdate";
import type { NextRequest } from "next/server";

/**
 * DELETE /api/(users)/delete-user
 * Delete user account and all associated data
 * @param request - NextRequest with authorization header and password in body
 * @returns Deletion confirmation
 */
export async function DELETE(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    // Parse request body safely
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch {
      requestBody = {};
    }

    // Validate input
    const { password } = validateAndSanitize(requestBody, deleteUserSchema);

    // Find user by authenticated ID
    const userAuth = await UserAuthModel.findById(authResult.user?.userId);
    if (!userAuth) {
      return sendNotFound("User not found", requestId);
    }

    // Verify password if user has one
    const userHasPassword = Boolean(userAuth.password);
    if (userHasPassword) {
      if (!password) {
        return sendBadRequest(
          "Password is required to delete your account",
          undefined,
          requestId,
        );
      }

      const isPasswordValid = await verifyPassword(password, userAuth.password);
      if (!isPasswordValid) {
        logAuthEvent("failed_login", userAuth._id.toString(), {
          reason: "invalid_password_for_deletion",
        });
        return sendBadRequest("Incorrect password", undefined, requestId);
      }
    }

    // Delete all user data
    await UserModel.deleteOne({ userAuth: userAuth._id });
    await UserSessionModel.deleteMany({ userAuth: userAuth._id });
    await UserAuthModel.findByIdAndDelete(userAuth._id);

    // Log account deletion
    logAuthEvent("logout", userAuth._id.toString(), {
      reason: "account_deleted",
    });

    return sendSuccess(
      "User account deleted successfully",
      { message: "Your account has been permanently deleted" },
      requestId,
    );
  } catch (error) {
    logApiError("/api/delete-user", error, { method: "DELETE" });
    const appError = handleApiError(error, {
      endpoint: "/api/delete-user",
      method: "DELETE",
    });
    return sendAppError(appError, requestId);
  }
}
