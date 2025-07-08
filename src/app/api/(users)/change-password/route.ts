import { hashPassword, verifyPassword } from '@/helpers/hashPassword';
import { requireAuth } from '@/lib/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import { sendResponse } from '@/lib/sendResponse';
import { UserAuthModel } from '@/models/users';
import { changePasswordSchema } from '@/zod/usersUpdate';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { currentPassword, newPassword, confirmPassword } =
      await request.json();

    // Validate request body
    const { error } = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (error) {
      return sendResponse(error.message, 400);
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return sendResponse(
        'New password and confirm password do not match',
        400
      );
    }

    // Find user auth by authenticated user ID
    const userAuth = await UserAuthModel.findById(authResult.user!.userId);
    if (!userAuth) {
      return sendResponse('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(
      currentPassword,
      userAuth.password
    );
    if (!isCurrentPasswordValid) {
      return sendResponse('Current password is incorrect', 400);
    }

    // Check if new password is different from current password
    const isSamePassword = await verifyPassword(newPassword, userAuth.password);
    if (isSamePassword) {
      return sendResponse(
        'New password must be different from current password',
        400
      );
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    userAuth.password = hashedNewPassword;
    userAuth.updatedAt = new Date();
    await userAuth.save();

    return sendResponse('Password changed successfully', 200, {
      message: 'Your password has been updated successfully',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return sendResponse('Internal Server Error', 500, null, error.message);
    }
    return sendResponse(
      'Internal Server Error',
      500,
      null,
      'Unknown error occurred'
    );
  }
}
