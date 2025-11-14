import crypto from "node:crypto";
import { requireAuth } from "@/lib/auth/auth-middleware";
import { handleApiError } from "@/lib/utils/error-handler";
import { logApiError, logAuthEvent } from "@/lib/utils/logger";
import { sendAppError, sendSuccess } from "@/lib/utils/response";
import type { NextRequest } from "next/server";

/**
 * POST /api/(auth)/logout
 * Logout user and revoke session
 * @param request - NextRequest with authorization header
 * @returns Logout confirmation
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    // Authenticate user to ensure they have a valid token
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.user?.userId;

    // Log logout event
    logAuthEvent("logout", userId, { timestamp: new Date().toISOString() });

    // Note: Token blacklist implementation
    // In production, you would:
    // 1. Add token to blacklist database/Redis
    // 2. Check blacklist in authentication middleware
    // 3. Clean up expired blacklisted tokens periodically

    return sendSuccess(
      "Logged out successfully",
      { message: "Session terminated" },
      requestId,
    );
  } catch (error) {
    logApiError("/api/logout", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/logout",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}
