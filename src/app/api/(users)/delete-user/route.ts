import { verifyPassword } from '@/helpers/hashPassword';
import { sendResponse } from '@/lib/apis/sendResponse';
import { requireAuth } from '@/lib/auth/authMiddleware';
import { UserAuthModel, UserModel } from '@/models/users';
import { deleteUserSchema } from '@/zod/usersUpdate';
import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { password } = await request.json();

    // Validate request body
    const { error } = deleteUserSchema.safeParse({ password });
    if (error) {
      return sendResponse(error.message, 400);
    }

    // Find user by authenticated ID
    const userAuth = await UserAuthModel.findById(authResult.user!.userId);
    if (!userAuth) {
      return sendResponse('User not found', 404);
    }

    // Verify password
    if (!password || !userAuth.password) {
      return sendResponse('Password is required', 400);
    }

    const isPasswordValid = await verifyPassword(password, userAuth.password);
    if (!isPasswordValid) {
      return sendResponse('Incorrect password', 400);
    }

    // Delete user profile (if exists)
    await UserModel.deleteOne({ authUser: userAuth._id });

    // Delete user authentication record
    await UserAuthModel.findByIdAndDelete(userAuth._id);

    return sendResponse('User account deleted successfully', 200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return sendResponse(error.message, 500, null, error);
    }
    return sendResponse('Unknown error occurred', 500, null, error);
  }
}
