import crypto from "node:crypto";
import { generateTokenPair, verifyRefreshToken } from "@/helpers/jwt-token";
import { touchSession } from "@/lib/auth/session-tracker";
import dbConnect from "@/lib/config/db-connect";
import { handleApiError } from "@/lib/utils/error-handler";
import { logApiError, logAuthEvent } from "@/lib/utils/logger";
import {
  sendAppError,
  sendForbidden,
  sendSuccess,
  sendUnauthorized,
} from "@/lib/utils/response";
import { validateAndSanitize } from "@/lib/utils/validators";
import { UserAuthModel } from "@/models/users";
import { refreshTokenSchema } from "@/zod/authValidation";
import type { NextRequest } from "next/server";

/**
 * POST /api/auth/refresh-token
 * Refresh access token using refresh token
 * @param request - NextRequest with refreshToken in body and x-session-id header
 * @returns New access token and refresh token
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const { refreshToken } = validateAndSanitize(body, refreshTokenSchema);

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if user still exists and is verified
    const userAuth = await UserAuthModel.findById(decoded.userId);
    if (!userAuth) {
      logAuthEvent("failed_login", decoded.userId, {
        reason: "user_not_found",
      });
      return sendUnauthorized("User not found", requestId);
    }

    if (!userAuth.isVerified) {
      logAuthEvent("failed_login", userAuth._id.toString(), {
        reason: "unverified_account",
      });
      return sendForbidden("Account not verified", requestId);
    }

    // Validate session
    const sessionId = request.headers.get("x-session-id");
    if (!sessionId) {
      return sendUnauthorized("Session context missing", requestId);
    }

    const activeSession = await touchSession(decoded.userId, sessionId);
    if (!activeSession) {
      logAuthEvent("failed_login", userAuth._id.toString(), {
        reason: "session_revoked",
      });
      return sendUnauthorized(
        "Session revoked. Please log in again.",
        requestId,
      );
    }

    // Generate new token pair
    const tokens = generateTokenPair(userAuth._id.toString(), userAuth.email);

    // Log token refresh
    logAuthEvent("token_refresh", userAuth._id.toString(), { sessionId });

    // Return success response
    return sendSuccess(
      "Tokens refreshed successfully",
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: userAuth._id,
          email: userAuth.email,
          isVerified: userAuth.isVerified,
        },
      },
      requestId,
    );
  } catch (error) {
    logApiError("/api/auth/refresh-token", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/auth/refresh-token",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}
