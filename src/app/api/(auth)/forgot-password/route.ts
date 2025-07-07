import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { forgotPasswordSchema } from '@/zod/authValidation';
import { UserAuthModel } from '@/models/users';
import { generateOtp, generateOtpExpiration } from '@/helpers/generateOtp';
import { sendForgotPasswordEmail } from '@/mail-templates/emailService';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email } = await request.json();
    const { error } = forgotPasswordSchema.safeParse({ email });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // check if user exists
    const userAuth = await UserAuthModel.findOne({ email });
    if (!userAuth) {
      return NextResponse.json(
        { message: 'User not found, Please Sign Up' },
        { status: 404 }
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
    await sendForgotPasswordEmail(
      userAuth.email,
      userAuth.firstName,
      resetPasswordToken
    );

    return NextResponse.json(
      { message: 'Reset password email sent' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
