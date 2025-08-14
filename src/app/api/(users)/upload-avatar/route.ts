import { sendResponse } from '@/lib/apis/sendResponse';
import { utapi } from '@/lib/apis/uploadthing/core';
import { requireAuth } from '@/lib/auth/authMiddleware';
import dbConnect from '@/lib/config/dbConnect';
import { UserModel } from '@/models/users';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { avatar } = await request.json();

    if (!avatar || typeof avatar !== 'string') {
      return sendResponse('Avatar URL is required', 400);
    }

    // Find user by authenticated user ID
    const user = await UserModel.findOne({ authUser: authResult.user!.userId });
    if (!user) {
      return sendResponse('User profile not found', 404);
    }

    // Update avatar
    user.avatar = avatar;
    await user.save();

    return sendResponse('Avatar updated successfully', 200);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse(errorMessage, 500, null, error);
  }
}

export async function DELETE(request: NextRequest) {
  await dbConnect();
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    // Find user by authenticated user ID
    const user = await UserModel.findOne({ authUser: authResult.user!.userId });
    if (!user) {
      return sendResponse('User profile not found', 404);
    }

    // Check if user has an avatar to delete
    if (!user.avatar) {
      return sendResponse('No avatar to delete', 400);
    }

    // Extract file key from the avatar URL
    // UploadThing URLs typically contain the file key
    const urlParts = user.avatar.split('/');
    const fileName = urlParts[urlParts.length - 1];

    try {
      // Delete file from UploadThing
      await utapi.deleteFiles(fileName);
    } catch (deleteError) {
      console.warn('Failed to delete file from UploadThing:', deleteError);
      // Continue with database cleanup even if UploadThing deletion fails
    }

    // Delete avatar from database
    user.avatar = '';
    await user.save();

    return sendResponse('Avatar deleted successfully', 200);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse(errorMessage, 500, null, error);
  }
}
