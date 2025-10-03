import { hashPassword, verifyPassword } from '@/helpers/hashPassword';
import { sendResponse } from '@/lib/apis/sendResponse';
import { requireAuth } from '@/lib/auth/authMiddleware';
import dbConnect from '@/lib/config/dbConnect';
import { UserAuthModel } from '@/models/users';
import { changePasswordSchema, setPasswordSchema } from '@/zod/usersUpdate';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    // Find user auth by authenticated user ID
    const userAuth = await UserAuthModel.findById(authResult.user!.userId);
    if (!userAuth) {
      return sendResponse('User not found', 404);
    }

    const hasExistingPassword = Boolean(userAuth.password);
    const validationSchema = hasExistingPassword ? changePasswordSchema : setPasswordSchema;

    const validationResult = validationSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validationResult.success) {
      return sendResponse(validationResult.error.message, 400);
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return sendResponse('New password and confirm password do not match', 400);
    }

    if (hasExistingPassword) {
      if (!currentPassword || !userAuth.password) {
        return sendResponse('Current password is required', 400);
      }

      const isCurrentPasswordValid = await verifyPassword(currentPassword, userAuth.password);

      if (!isCurrentPasswordValid) {
        return sendResponse('Current password is incorrect', 400);
      }

      const isSamePassword = await verifyPassword(newPassword, userAuth.password);

      if (isSamePassword) {
        return sendResponse('New password must be different from current password', 400);
      }
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    userAuth.password = hashedNewPassword;
    userAuth.updatedAt = new Date();
    await userAuth.save();

    return sendResponse('Password changed successfully', 200, {
      message: hasExistingPassword
        ? 'Your password has been updated successfully'
        : 'Password added successfully. You can now sign in with email too.',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return sendResponse(error.message, 500, null, error);
    }
    return sendResponse('Unknown error occurred', 500, null, error);
  }
}
