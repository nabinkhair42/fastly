import { hashPassword } from '@/helpers/hashPassword';
import { sendResponse } from '@/lib/apis/sendResponse';
import dbConnect from '@/lib/config/dbConnect';
import { UserAuthModel } from '@/models/users';
import { resetPasswordRequestSchema } from '@/zod/authValidation';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email, resetToken, password, confirmPassword } = await request.json();

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
    if (userAuth.resetPasswordTokenExpiresAt && userAuth.resetPasswordTokenExpiresAt < new Date()) {
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
    userAuth.resetPasswordToken = null;
    userAuth.resetPasswordTokenExpiresAt = null;
    userAuth.updatedAt = new Date();
    await userAuth.save();

    return sendResponse('Password reset successfully', 200);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse(errorMessage, 500, null, error);
  }
}
