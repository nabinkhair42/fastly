import crypto from "node:crypto";
import { requireAuth } from "@/lib/auth/auth-middleware";
import dbConnect from "@/lib/config/db-connect";
import { handleApiError } from "@/lib/utils/error-handler";
import { logApiError } from "@/lib/utils/logger";
import {
  sendAppError,
  sendBadRequest,
  sendConflict,
  sendNotFound,
  sendSuccess,
} from "@/lib/utils/response";
import { sanitizeString, validateAndSanitize } from "@/lib/utils/validators";
import { UserModel } from "@/models/users";
import {
  changeUsernameSchema,
  checkUsernameAvailabilitySchema,
} from "@/zod/usersUpdate";
import type { NextRequest } from "next/server";

/**
 * POST /api/(users)/change-username
 * Update user username
 * @param request - NextRequest with authorization header and username in body
 * @returns Updated username confirmation
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
    const { username } = validateAndSanitize(body, changeUsernameSchema);
    const sanitizedUsername = sanitizeString(username.trim());

    // Find user by authenticated user ID
    const user = await UserModel.findOne({ userAuth: authResult.user?.userId });
    if (!user) {
      return sendNotFound("User profile not found", requestId);
    }

    // Check if username already changed
    if (user.hasChangedUsername) {
      return sendBadRequest(
        "Username can only be changed once. You have already updated your username.",
        undefined,
        requestId,
      );
    }

    // Check if new username is same as current
    if (sanitizedUsername === user.username) {
      return sendBadRequest(
        "New username must be different from current username",
        undefined,
        requestId,
      );
    }

    // Check if username is already taken
    const existingUser = await UserModel.findOne({
      username: sanitizedUsername,
      _id: { $ne: user._id },
    });
    if (existingUser) {
      return sendConflict("Username already taken", undefined, requestId);
    }

    // Update username
    await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          username: sanitizedUsername,
          hasChangedUsername: true,
        },
      },
      { new: true, runValidators: true },
    );

    return sendSuccess(
      "Username updated successfully",
      { username: sanitizedUsername },
      requestId,
    );
  } catch (error) {
    logApiError("/api/change-username", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/change-username",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}

/**
 * GET /api/(users)/change-username
 * Check if username is available
 * @param request - NextRequest with authorization header and username query param
 * @returns Availability status
 */
export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const username = request.nextUrl.searchParams.get("username");
    if (!username) {
      return sendBadRequest("Username is required", undefined, requestId);
    }

    const { username: validatedUsername } = validateAndSanitize(
      { username },
      checkUsernameAvailabilitySchema,
    );
    const sanitizedUsername = sanitizeString(validatedUsername.trim());

    // Check if username is already taken
    const existingUser = await UserModel.findOne({
      username: sanitizedUsername,
      _id: { $ne: authResult.user?.userId },
    });
    if (existingUser) {
      return sendConflict("Username already taken", undefined, requestId);
    }

    return sendSuccess("Username is available", { available: true }, requestId);
  } catch (error) {
    logApiError("/api/change-username", error, { method: "GET" });
    const appError = handleApiError(error, {
      endpoint: "/api/change-username",
      method: "GET",
    });
    return sendAppError(appError, requestId);
  }
}
