import { generateOtp, generateOtpExpiration } from '@/helpers/generateOtp';
import { sendResponse } from '@/lib/apis/send-response';
import dbConnect from '@/lib/config/db-connect';
import { sendForgotPasswordEmail } from '@/mail-templates/email-service';
import { UserAuthModel } from '@/models/users';
import { AuthMethod } from '@/types/user';
import { forgotPasswordSchema } from '@/zod/authValidation';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email } = await request.json();
    const { error } = forgotPasswordSchema.safeParse({ email });

    if (error) {
      return sendResponse(error.message, 400);
    }

    // check if user exists
    const userAuth = await UserAuthModel.findOne({ email });
    if (!userAuth) {
      return sendResponse('User not found. Please sign up first.', 404);
    }

    // check if user uses email authentication
    if (userAuth.authMethod !== AuthMethod.EMAIL) {
      return sendResponse(
        `User uses ${userAuth.authMethod} authentication. Please login try logging in with email.`,
        400
      );
    }

    // generate reset password token
    const resetPasswordToken = generateOtp();

    // generate reset password token expires at
    const resetPasswordTokenExpiresAt = generateOtpExpiration();

    // update user auth
    userAuth.resetPasswordToken = resetPasswordToken;
    userAuth.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;
    await userAuth.save();

    // send reset password email
    await sendForgotPasswordEmail(userAuth.email, userAuth.firstName, resetPasswordToken);

    return sendResponse('Password reset email sent successfully', 200);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse(errorMessage, 500, null, error);
  }
}
