import { generateOtp } from '@/helpers/generateOtp';
import { sendResponse } from '@/lib/apis/send-response';
import dbConnect from '@/lib/config/db-connect';
import { sendVerificationEmail } from '@/mail-templates/email-service';
import { UserAuthModel } from '@/models/users';
import { resendVerificationEmailSchema } from '@/zod/authValidation';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { email } = await req.json();
    const { error } = resendVerificationEmailSchema.safeParse({ email });

    if (error) {
      return sendResponse(error.message, 400);
    }

    // check if user exists
    const userAuth = await UserAuthModel.findOne({ email });
    if (!userAuth) {
      return sendResponse('User not found', 404);
    }

    // check if user is already verified
    if (userAuth.isVerified) {
      return sendResponse('User already verified', 400);
    }

    // generate verification code
    const verificationCode = generateOtp();

    // generate verification code expires at
    const verificationCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 5);

    // update user auth
    userAuth.verificationCode = verificationCode;
    userAuth.verificationCodeExpiresAt = verificationCodeExpiresAt;
    await userAuth.save();

    // send verification email
    await sendVerificationEmail(userAuth.email, userAuth.firstName, verificationCode);

    return sendResponse('Verification code sent to email', 200);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse(errorMessage, 500, null, error);
  }
}
