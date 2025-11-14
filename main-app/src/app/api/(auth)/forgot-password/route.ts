import crypto from "node:crypto";
import { generateOtp, generateOtpExpiration } from "@/helpers/generate-otp";
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
import { sendForgotPasswordEmail } from "@/mail-templates";
import { UserAuthModel } from "@/models/users";
import { AuthMethod } from "@/types/user";
import { forgotPasswordSchema } from "@/zod/authValidation";
import type { NextRequest } from "next/server";

/**
 * POST /api/(auth)/forgot-password
 * Send password reset email
 * @param request - NextRequest with email in body
 * @returns Confirmation message
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const { email } = validateAndSanitize(body, forgotPasswordSchema);
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

    // Verify user uses email authentication
    if (userAuth.authMethod !== AuthMethod.EMAIL) {
      logAuthEvent("failed_login", userAuth._id.toString(), {
        reason: "non_email_auth",
        authMethod: userAuth.authMethod,
      });
      return sendBadRequest(
        `User uses ${userAuth.authMethod} authentication. Please try logging in with ${userAuth.authMethod}.`,
        undefined,
        requestId,
      );
    }

    // Generate reset password token
    const resetPasswordToken = generateOtp();
    const resetPasswordTokenExpiresAt = generateOtpExpiration();

    // Update user with reset token
    userAuth.resetPasswordToken = resetPasswordToken;
    userAuth.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;
    await userAuth.save();

    // Send reset password email
    await sendForgotPasswordEmail(
      userAuth.email,
      userAuth.firstName,
      resetPasswordToken,
    );

    // Log event
    logAuthEvent("failed_login", userAuth._id.toString(), {
      reason: "password_reset_requested",
    });

    // Return success response
    return sendSuccess(
      "Password reset email sent successfully",
      { message: "Check your email for reset instructions" },
      requestId,
    );
  } catch (error) {
    logApiError("/api/forgot-password", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/forgot-password",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}
