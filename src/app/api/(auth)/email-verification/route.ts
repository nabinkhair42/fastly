import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { verifyEmailSchema } from '@/zod/authValidation';
import { generateJwtToken } from '@/helpers/jwtToken';
import { sendWelcomeEmail } from '@/mail-templates/emailService';
import { UserModel, UserAuthModel } from '@/models/users';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { verificationCode } = await request.json();
    const { error } = verifyEmailSchema.safeParse({ verificationCode });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // check if verification code is valid
    const userAuth = await UserAuthModel.findOne({ verificationCode });
    if (!userAuth) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // check if verification code has expired
    if (
      userAuth.verificationCodeExpiresAt &&
      userAuth.verificationCodeExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { message: 'Verification code has expired' },
        { status: 400 }
      );
    }

    // check if user is already verified
    if (userAuth.isVerified) {
      return NextResponse.json(
        { message: 'User already verified' },
        { status: 400 }
      );
    }

    // verify user
    userAuth.isVerified = true;
    await userAuth.save();

    // create user
    await UserModel.create({ authUser: userAuth._id });

    // generate jwt token
    const jwtToken = generateJwtToken({ userId: userAuth._id });

    // send welcome email
    await sendWelcomeEmail(userAuth.email, jwtToken);

    return NextResponse.json(
      { message: 'User verified successfully', jwtToken },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
