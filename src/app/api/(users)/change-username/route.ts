import { requireAuth } from '@/lib/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import { sendResponse } from '@/lib/sendResponse';
import { UserModel } from '@/models/users';
import {
  changeUsernameSchema,
  checkUsernameAvailabilitySchema,
} from '@/zod/usersUpdate';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { username } = await request.json();

    // Validate request body
    const { error } = changeUsernameSchema.safeParse({ username });
    if (error) {
      return sendResponse(error.message, 400);
    }

    // Find user by authenticated user ID
    const user = await UserModel.findOne({ authUser: authResult.user!.userId });
    if (!user) {
      return sendResponse('User profile not found', 404);
    }

    // Check if user has already changed username once
    if (user.hasChangedUsername) {
      return sendResponse(
        'Username can only be changed once. You have already updated your username.',
        400
      );
    }

    // Check if new username is already taken (excluding current user)
    const existingUser = await UserModel.findOne({
      username: username.trim(),
      _id: { $ne: user._id },
    });
    if (existingUser) {
      return sendResponse('Username already taken', 400);
    }

    // Check if username is the same as current
    if (username.trim() === user.username) {
      return sendResponse(
        'New username must be different from current username',
        400
      );
    }

    // Update username and mark as changed
    await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          username: username.trim(),
          hasChangedUsername: true,
        },
      },
      { new: true, runValidators: true } // runValidators is true to ensure the username is unique
    );

    return sendResponse('Username updated successfully', 200);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse('Internal Server Error', 500, null, errorMessage);
  }
}

// check if username is available
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const username = request.nextUrl.searchParams.get('username');
    if (!username) {
      return sendResponse('Username is required', 400);
    }

    // Validate request body
    const { error } = checkUsernameAvailabilitySchema.safeParse({ username });
    if (error) {
      return sendResponse(error.message, 400);
    }

    // Find current user's profile to get their UserModel _id
    const currentUser = await UserModel.findOne({
      authUser: authResult.user!.userId,
    });
    if (!currentUser) {
      return sendResponse('User profile not found', 404);
    }

    // Check if username is already taken (excluding current user)
    const existingUser = await UserModel.findOne({
      username: username.trim(),
      _id: { $ne: currentUser._id },
    });
    if (existingUser) {
      return sendResponse('Username already taken', 400);
    }

    return sendResponse('Username is available', 200);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse('Internal Server Error', 500, null, errorMessage);
  }
}
