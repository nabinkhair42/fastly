import crypto from "node:crypto";
import { verifyPassword } from "@/helpers/hash-password";
import { generateTokenPair } from "@/helpers/jwt-token";
import { createUserSession } from "@/lib/auth/session-tracker";
import dbConnect from "@/lib/config/db-connect";
import { handleApiError } from "@/lib/utils/error-handler";
import { logApiError, logAuthEvent } from "@/lib/utils/logger";
import {
  sendAppError,
  sendForbidden,
  sendSuccess,
  sendUnauthorized,
} from "@/lib/utils/response";
import { sanitizeEmail, validateAndSanitize } from "@/lib/utils/validators";
import { UserAuthModel } from "@/models/users";
import { loginSchema } from "@/zod/authValidation";
import type { NextRequest } from "next/server";

/**
 * POST /api/log-in
 * Authenticate user with email and password
 * @param request - NextRequest with email and password in body
 * @returns Login response with tokens and session info
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const { email, password } = validateAndSanitize(body, loginSchema);
    const sanitizedEmail = sanitizeEmail(email);

    // Check if user exists
    const userAuth = await UserAuthModel.findOne({ email: sanitizedEmail });
    if (!userAuth) {
      logAuthEvent("failed_login", undefined, {
        reason: "user_not_found",
        email: sanitizedEmail,
      });
      return sendUnauthorized(
        "User not found. Please create an account to continue.",
        requestId,
      );
    }

    // Check if user was created with OAuth (no password)
    if (!userAuth.password) {
      const authMethod =
        userAuth.authMethod.charAt(0).toUpperCase() +
        userAuth.authMethod.slice(1);
      logAuthEvent("failed_login", userAuth._id.toString(), {
        reason: "oauth_account",
        authMethod,
      });
      return sendUnauthorized(
        `This account was created with ${authMethod}. Please use ${authMethod} to login.`,
        requestId,
      );
    }

    // Verify password
    const isPasswordCorrect = await verifyPassword(password, userAuth.password);
    if (!isPasswordCorrect) {
      logAuthEvent("failed_login", userAuth._id.toString(), {
        reason: "invalid_password",
      });
      return sendUnauthorized(
        "Incorrect password. Please try again.",
        requestId,
      );
    }

    // Check if user is verified
    if (!userAuth.isVerified) {
      logAuthEvent("failed_login", userAuth._id.toString(), {
        reason: "unverified_account",
      });
      return sendForbidden(
        "Please verify your email address before logging in. Check your email for verification code.",
        requestId,
      );
    }

    // Generate secure token pair
    const tokens = generateTokenPair(userAuth._id.toString(), userAuth.email);

    // Create user session
    const session = await createUserSession({
      userAuthId: userAuth._id.toString(),
      authMethod: userAuth.authMethod,
      request,
    });

    // Log successful login
    logAuthEvent("login", userAuth._id.toString(), {
      provider: userAuth.authMethod,
    });

    // Return success response
    return sendSuccess(
      "Login successful",
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
        },
      },
      requestId,
    );
  } catch (error) {
    logApiError("/api/log-in", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/log-in",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}
