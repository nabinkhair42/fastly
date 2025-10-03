import { verifyPassword } from '@/helpers/hash-password';
import { sendResponse } from '@/lib/apis/send-response';
import { requireAuth } from '@/lib/auth/auth-middleware';
import { UserSessionModel } from '@/models/user-sessions';
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

    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch {
      requestBody = {};
    }

    const parsedBody = deleteUserSchema.safeParse(requestBody);
    if (!parsedBody.success) {
      return sendResponse(parsedBody.error.message, 400);
    }

    const { password } = parsedBody.data;

    // Find user by authenticated ID
    const userAuth = await UserAuthModel.findById(authResult.user!.userId);
    if (!userAuth) {
      return sendResponse('User not found', 404);
    }

    const userHasPassword = Boolean(userAuth.password);

    if (userHasPassword) {
      if (!password) {
        return sendResponse('Password is required to delete your account', 400);
      }

      const isPasswordValid = await verifyPassword(password, userAuth.password);
      if (!isPasswordValid) {
        return sendResponse('Incorrect password', 400);
      }
    }

    // Delete user profile (if exists)
    await UserModel.deleteOne({ userAuth: userAuth._id });

    // Delete user authentication record
    await UserAuthModel.findByIdAndDelete(userAuth._id);

    // Delete User Sessions(if exists)
    await UserSessionModel.deleteMany({ userAuth: userAuth._id });

    return sendResponse('User account deleted successfully', 200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return sendResponse(error.message, 500, null, error);
    }
    return sendResponse('Unknown error occurred', 500, null, error);
  }
}
