import { sendResponse } from '@/lib/apis/sendResponse';
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
