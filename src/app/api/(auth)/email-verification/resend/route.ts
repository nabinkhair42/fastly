import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { verifyEmailSchema } from '@/zod/authValidation';
import { generateOtp } from '@/helpers/generateOtp';
import { UserAuthModel } from '@/models/users';
import { sendVerificationEmail } from '@/mail-templates/emailService';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { email } = await req.json();
    const { error } = verifyEmailSchema.safeParse({ email });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // check if user exists
    const userAuth = await UserAuthModel.findOne({ email });
    if (!userAuth) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // check if user is already verified
    if (userAuth.isVerified) {
      return NextResponse.json(
        { message: 'User already verified' },
        { status: 400 }
      );
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
    await sendVerificationEmail(
      userAuth.email,
      userAuth.firstName,
      verificationCode
    );

    return NextResponse.json(
      { message: 'Verification code sent to email' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
