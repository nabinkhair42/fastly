import { hashPassword } from '@/helpers/hashPassword';
import dbConnect from '@/lib/dbConnect';
import { sendResponse } from '@/lib/sendResponse';
import { UserAuthModel } from '@/models/users';
import { AuthIdentity } from '@/types/user';
import { resetPasswordRequestSchema } from '@/zod/authValidation';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email, resetToken, password, confirmPassword } =
      await request.json();

    // Validate request body
    const { error } = resetPasswordRequestSchema.safeParse({
      email,
      resetToken,
      password,
      confirmPassword,
    });

    if (error) {
      return sendResponse(error.message, 400);
    }

    // check if user exists
    const userAuth = await UserAuthModel.findOne({ email });
    if (!userAuth) {
      return sendResponse('User not found. Please sign up first.', 404);
    }

    // check if reset password token is valid
    if (userAuth.resetPasswordToken !== resetToken) {
      return sendResponse('Invalid or expired reset password token', 400);
    }

    // check if reset password token has expired
    if (
      userAuth.resetPasswordTokenExpiresAt &&
      userAuth.resetPasswordTokenExpiresAt < new Date()
    ) {
      return sendResponse('Reset password token has expired', 400);
    }

    // check if password and confirm password match
    if (password !== confirmPassword) {
      return sendResponse('Password and confirm password do not match', 400);
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // update user auth and clear reset token
    userAuth.password = hashedPassword;
    userAuth.hasPassword = true; // Ensure hasPassword is set to true
    userAuth.resetPasswordToken = null;
    userAuth.resetPasswordTokenExpiresAt = null;
    userAuth.updatedAt = new Date();

    // Add email identity if user doesn't have one (OAuth users setting password for first time)
    const hasEmailIdentity = userAuth.identities.some(
      (identity: AuthIdentity) => identity.provider === 'email'
    );

    if (!hasEmailIdentity) {
      userAuth.identities.push({
        provider: 'email',
        providerId: email,
        providerEmail: email,
        isVerified: userAuth.isVerified, // Use existing verification status
        isPrimary: userAuth.identities.length === 0, // First identity is primary
        linkedAt: new Date(),
      });
    }

    await userAuth.save();

    return sendResponse('Password reset successfully', 200, {
      message:
        'Your password has been reset successfully. You can now sign in with your email and password.',
      canLoginWithEmail: true,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse('Internal Server Error', 500, null, errorMessage);
  }
}
