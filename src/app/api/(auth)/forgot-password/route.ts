import { generateOtp, generateOtpExpiration } from '@/helpers/generateOtp';
import dbConnect from '@/lib/dbConnect';
import { sendResponse } from '@/lib/sendResponse';
import { sendForgotPasswordEmail } from '@/mail-templates/emailService';
import { UserAuthModel } from '@/models/users';
import {
  canLoginWithEmail,
  getUserLoginMethods,
} from '@/services/accountLinkingService';
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

    // Check if user can login with email/password
    if (!canLoginWithEmail(userAuth)) {
      const availableMethods = getUserLoginMethods(userAuth);
      const oauthMethods = availableMethods.filter(
        method => method !== 'email'
      );

      if (oauthMethods.length > 0) {
        return sendResponse(
          `This account was created using ${oauthMethods.join(' or ')}. Please sign in using that method, then set up a password in your account settings.`,
          400,
          {
            availableLoginMethods: availableMethods,
            hasPassword: userAuth.hasPassword,
            canSetPassword: !userAuth.hasPassword,
          }
        );
      } else {
        return sendResponse(
          'This account does not have password login enabled. Please contact support.',
          400
        );
      }
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
    await sendForgotPasswordEmail(
      userAuth.email,
      userAuth.firstName,
      resetPasswordToken
    );

    return sendResponse('Password reset email sent successfully', 200);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse('Internal Server Error', 500, null, errorMessage);
  }
}
