import { hashPassword, verifyPassword } from '@/helpers/hashPassword';
import { requireAuth } from '@/lib/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import { sendResponse } from '@/lib/sendResponse';
import { UserAuthModel } from '@/models/users';
import { canLoginWithEmail } from '@/services/accountLinkingService';
import { AuthIdentity } from '@/types/user';
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

    // Find user auth by authenticated user ID
    const userAuth = await UserAuthModel.findById(authResult.user!.userId);
    if (!userAuth) {
      return sendResponse('User not found', 404);
    }

    // Check if user has a password (OAuth users might not have one initially)
    const hasExistingPassword = userAuth.hasPassword && userAuth.password;

    // Validate request body based on whether user has existing password
    if (hasExistingPassword) {
      // Existing password flow - require current password
      const { error } = changePasswordSchema.safeParse({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (error) {
        return sendResponse(error.message, 400);
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
      const isSamePassword = await verifyPassword(
        newPassword,
        userAuth.password
      );
      if (isSamePassword) {
        return sendResponse(
          'New password must be different from current password',
          400
        );
      }
    } else {
      // First-time password setup for OAuth users - no current password required
      if (!newPassword || !confirmPassword) {
        return sendResponse(
          'New password and confirm password are required',
          400
        );
      }

      if (newPassword.length < 8) {
        return sendResponse('Password must be at least 8 characters long', 400);
      }
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return sendResponse(
        'New password and confirm password do not match',
        400
      );
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    userAuth.password = hashedNewPassword;
    userAuth.hasPassword = true;
    userAuth.updatedAt = new Date();

    // Add email identity if user doesn't have one (OAuth users setting password for first time)
    const hasEmailIdentity = userAuth.identities.some(
      (identity: AuthIdentity) => identity.provider === 'email'
    );

    if (!hasEmailIdentity) {
      userAuth.identities.push({
        provider: 'email',
        providerId: userAuth.email,
        providerEmail: userAuth.email,
        isVerified: userAuth.isVerified, // Use existing verification status
        isPrimary: userAuth.identities.length === 0, // First identity is primary
        linkedAt: new Date(),
      });
    }

    await userAuth.save();

    const message = hasExistingPassword
      ? 'Your password has been updated successfully'
      : 'Password set successfully! You can now sign in with your email and password.';

    return sendResponse('Password changed successfully', 200, {
      message,
      canLoginWithEmail: canLoginWithEmail(userAuth),
      isFirstTimePasswordSetup: !hasExistingPassword,
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
