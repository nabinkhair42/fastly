import crypto from "node:crypto";
import { authenticateToken } from "@/helpers/jwt-token";
import { touchSession } from "@/lib/auth/session-tracker";
import dbConnect from "@/lib/config/db-connect";
import { sendForbidden, sendUnauthorized } from "@/lib/utils/response";
import { UserAuthModel } from "@/models/users";
import type { AuthenticatedUser } from "@/types/user";
import type { NextRequest } from "next/server";

export interface AuthenticationResult {
  success: boolean;
  user?: AuthenticatedUser;
  response?: Response;
}

/**
 * Authenticate user from JWT token
 * Returns user data if valid, or error response if invalid
 */
export const authenticate = async (
  request: NextRequest,
): Promise<AuthenticationResult> => {
  const requestId = crypto.randomUUID();
  try {
    // Extract and verify JWT token
    const decoded = authenticateToken(request);

    // Connect to database
    await dbConnect();

    // Verify user still exists and is verified
    const userAuth = await UserAuthModel.findById(decoded.userId);
    if (!userAuth) {
      return {
        success: false,
        response: sendUnauthorized("User not found", requestId),
      };
    }

    if (!userAuth.isVerified) {
      return {
        success: false,
        response: sendForbidden("Account not verified", requestId),
      };
    }

    const sessionId = request.headers.get("x-session-id");

    if (!sessionId) {
      return {
        success: false,
        response: sendUnauthorized("Session context missing", requestId),
      };
    }

    const activeSession = await touchSession(decoded.userId, sessionId);

    if (!activeSession) {
      return {
        success: false,
        response: sendUnauthorized(
          "Session revoked. Please log in again.",
          requestId,
        ),
      };
    }

    return {
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        firstName: userAuth.firstName || "",
        lastName: userAuth.lastName || "",
        username: userAuth.username || "",
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Authentication failed";

    if (errorMessage.includes("No token provided")) {
      return {
        success: false,
        response: sendUnauthorized("Authorization token required", requestId),
      };
    }

    if (errorMessage.includes("Invalid or expired")) {
      return {
        success: false,
        response: sendUnauthorized("Invalid or expired token", requestId),
      };
    }

    return {
      success: false,
      response: sendUnauthorized("Authentication failed", requestId),
    };
  }
};

/**
 * Middleware wrapper for protected routes
 * Usage: const authResult = await requireAuth(request);
 */
export const requireAuth = async (
  request: NextRequest,
): Promise<AuthenticationResult> => {
  return await authenticate(request);
};

/**
 * Check if user can access resource (user must own the resource)
 */
export const authorizeUser = (
  authenticatedUserId: string,
  resourceUserId: string,
): boolean => {
  return authenticatedUserId === resourceUserId;
};
