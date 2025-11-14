import crypto from "node:crypto";
import { generateTokenPair } from "@/helpers/jwt-token";
import { createUserSession } from "@/lib/auth/session-tracker";
import dbConnect from "@/lib/config/db-connect";
import { handleApiError } from "@/lib/utils/error-handler";
import { logApiError, logAuthEvent } from "@/lib/utils/logger";
import {
  sendAppError,
  sendBadRequest,
  sendSuccess,
} from "@/lib/utils/response";
import { sanitizeEmail, validateAndSanitize } from "@/lib/utils/validators";
import { sendWelcomeEmail } from "@/mail-templates";
import { UserAuthModel, UserModel } from "@/models/users";
import { verifyEmailSchema } from "@/zod/authValidation";
import type { NextRequest } from "next/server";

/**
 * POST /api/(auth)/email-verification
 * Verify user email with verification code
 * @param request - NextRequest with verificationCode and email in body
 * @returns Verification response with tokens
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const { verificationCode, email } = validateAndSanitize(
      body,
      verifyEmailSchema,
    );
    const sanitizedEmail = sanitizeEmail(email);

    // Find user by email and verification code
    const userAuth = await UserAuthModel.findOne({
      email: sanitizedEmail,
      verificationCode,
    });

    if (!userAuth) {
      logAuthEvent("failed_login", undefined, {
        reason: "invalid_verification_code",
        email: sanitizedEmail,
      });
      return sendBadRequest(
        "Invalid verification code or email",
        undefined,
        requestId,
      );
    }

    // Check if verification code has expired
    if (
      userAuth.verificationCodeExpiresAt &&
      userAuth.verificationCodeExpiresAt < new Date()
    ) {
      logAuthEvent("failed_login", userAuth._id.toString(), {
        reason: "expired_verification_code",
      });
      return sendBadRequest(
        "Verification code has expired",
        undefined,
        requestId,
      );
    }

    // Check if user is already verified
    if (userAuth.isVerified) {
      return sendBadRequest("User already verified", undefined, requestId);
    }

    // Validate required user data
    if (!userAuth.firstName || !userAuth.lastName) {
      return sendBadRequest(
        "Account creation failed: Missing required user information. Please create account again.",
        undefined,
        requestId,
      );
    }

    // Create user profile
    await UserModel.create({
      userAuth: userAuth._id,
      firstName: userAuth.firstName,
      lastName: userAuth.lastName,
      email: sanitizedEmail,
      username: `${userAuth.firstName.toLowerCase()}_${Date.now()}`,
    });

    // Mark user as verified and clear verification data
    userAuth.isVerified = true;
    userAuth.verificationCode = null;
    userAuth.verificationCodeExpiresAt = null;
    await userAuth.save();

    // Generate token pair
    const tokens = generateTokenPair(userAuth._id.toString(), userAuth.email);

    // Create session
    const session = await createUserSession({
      userAuthId: userAuth._id.toString(),
      authMethod: userAuth.authMethod,
      request,
    });

    // Send welcome email
    await sendWelcomeEmail(userAuth.email, userAuth.firstName);

    // Log successful verification
    logAuthEvent("signup", userAuth._id.toString(), {
      provider: userAuth.authMethod,
    });

    // Return success response
    return sendSuccess(
      "Email verified successfully",
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        session: {
          sessionId: session.sessionId,
          createdAt: session.createdAt.toISOString(),
          browser: session.browser,
          os: session.os,
          device: session.device,
          ipAddress: session.ipAddress,
        },
        user: {
          id: userAuth._id,
          email: userAuth.email,
          isVerified: userAuth.isVerified,
          firstName: userAuth.firstName,
          lastName: userAuth.lastName,
        },
      },
      requestId,
    );
  } catch (error) {
    logApiError("/api/email-verification", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/email-verification",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}
