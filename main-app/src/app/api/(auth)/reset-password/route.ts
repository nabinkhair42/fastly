import crypto from "node:crypto";
import { hashPassword } from "@/helpers/hash-password";
import dbConnect from "@/lib/config/db-connect";
import { handleApiError } from "@/lib/utils/error-handler";
import { logApiError, logAuthEvent } from "@/lib/utils/logger";
import {
  sendAppError,
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} from "@/lib/utils/response";
import { sanitizeEmail, validateAndSanitize } from "@/lib/utils/validators";
import { UserAuthModel } from "@/models/users";
import { resetPasswordRequestSchema } from "@/zod/authValidation";
import type { NextRequest } from "next/server";

/**
 * POST /api/(auth)/reset-password
 * Reset user password with reset token
 * @param request - NextRequest with email, resetToken, password, confirmPassword in body
 * @returns Confirmation message
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const { email, resetToken, password, confirmPassword } =
      validateAndSanitize(body, resetPasswordRequestSchema);
    const sanitizedEmail = sanitizeEmail(email);

    // Find user by email
    const userAuth = await UserAuthModel.findOne({ email: sanitizedEmail });
    if (!userAuth) {
      logAuthEvent("failed_login", undefined, {
        reason: "user_not_found",
        email: sanitizedEmail,
      });
      return sendNotFound("User not found. Please sign up first.", requestId);
    }

    // Validate reset token
    if (userAuth.resetPasswordToken !== resetToken) {
      logAuthEvent("failed_login", userAuth._id.toString(), {
        reason: "invalid_reset_token",
      });
      return sendBadRequest(
        "Invalid or expired reset password token",
        undefined,
        requestId,
      );
    }

    // Check if reset token has expired
    if (
      userAuth.resetPasswordTokenExpiresAt &&
      userAuth.resetPasswordTokenExpiresAt < new Date()
    ) {
      logAuthEvent("failed_login", userAuth._id.toString(), {
        reason: "expired_reset_token",
      });
      return sendBadRequest(
        "Reset password token has expired",
        undefined,
        requestId,
      );
    }

    // Verify passwords match
    if (password !== confirmPassword) {
      return sendBadRequest("Passwords do not match", undefined, requestId);
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user password and clear reset token
    userAuth.password = hashedPassword;
    userAuth.resetPasswordToken = null;
    userAuth.resetPasswordTokenExpiresAt = null;
    userAuth.updatedAt = new Date();
    await userAuth.save();

    // Log password reset
    logAuthEvent("failed_login", userAuth._id.toString(), {
      reason: "password_reset_completed",
    });

    // Return success response
    return sendSuccess(
      "Password reset successfully",
      { message: "You can now login with your new password" },
      requestId,
    );
  } catch (error) {
    logApiError("/api/reset-password", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/reset-password",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}
