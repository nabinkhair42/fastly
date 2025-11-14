import crypto from "node:crypto";
import { utapi } from "@/lib/apis/uploadthing/core";
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
import { UserModel } from "@/models/users";
import type { NextRequest } from "next/server";

/**
 * POST /api/(users)/upload-avatar
 * Update user avatar
 * @param request - NextRequest with authorization header and avatar URL in body
 * @returns Updated avatar confirmation
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { avatar } = await request.json();

    if (!avatar || typeof avatar !== "string") {
      return sendBadRequest("Avatar URL is required", undefined, requestId);
    }

    // Find user by authenticated user ID
    const user = await UserModel.findOne({ userAuth: authResult.user?.userId });
    if (!user) {
      return sendNotFound("User profile not found", requestId);
    }

    // Update avatar
    user.avatar = avatar;
    await user.save();

    return sendSuccess("Avatar updated successfully", { avatar }, requestId);
  } catch (error) {
    logApiError("/api/upload-avatar", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/upload-avatar",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}

/**
 * DELETE /api/(users)/upload-avatar
 * Delete user avatar
 * @param request - NextRequest with authorization header
 * @returns Deletion confirmation
 */
export async function DELETE(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    // Find user by authenticated user ID
    const user = await UserModel.findOne({ userAuth: authResult.user?.userId });
    if (!user) {
      return sendNotFound("User profile not found", requestId);
    }

    // Check if user has an avatar to delete
    if (!user.avatar) {
      return sendBadRequest("No avatar to delete", undefined, requestId);
    }

    // Extract file key from the avatar URL
    const urlParts = user.avatar.split("/");
    const fileName = urlParts[urlParts.length - 1];

    try {
      // Delete file from UploadThing
      await utapi.deleteFiles(fileName);
    } catch (deleteError) {
      logApiError("/api/upload-avatar", deleteError, { method: "DELETE" });
      // Continue with database cleanup even if UploadThing deletion fails
    }

    // Delete avatar from database
    user.avatar = "";
    await user.save();

    return sendSuccess(
      "Avatar deleted successfully",
      { message: "Avatar removed" },
      requestId,
    );
  } catch (error) {
    logApiError("/api/upload-avatar", error, { method: "DELETE" });
    const appError = handleApiError(error, {
      endpoint: "/api/upload-avatar",
      method: "DELETE",
    });
    return sendAppError(appError, requestId);
  }
}
