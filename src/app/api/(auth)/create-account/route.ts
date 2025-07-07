import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { createAccountSchema } from '@/zod/authValidation';
import { sendVerificationEmail } from '@/mail-templates/emailService';
import { generateOtp } from '@/helpers/generateOtp';
import { hashPassword } from '@/helpers/hashPassword';
import { UserAuthModel } from '@/models/users';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { firstName, lastName, email, password, confirmPassword } =
      await request.json();
    const { error } = createAccountSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // check if user already exists
    const existingUser = await UserAuthModel.findOne({ email });
    if (existingUser) {
      const existingUserAuthMethod =
        (existingUser?.authMethod).charAt(0).toUpperCase() +
        (existingUser?.authMethod).slice(1);

      return NextResponse.json(
        {
          message: `User already exists with ${existingUserAuthMethod} method`,
        },
        { status: 400 }
      );
    }

    // check if password and confirm password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Password and confirm password do not match' },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // generate verification code
    const verificationCode = generateOtp();

    // generate verification code expires at
    const verificationCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 5);

    // create user auth
    await UserAuthModel.create({
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt,
      firstName,
    });

    // send verification email
    await sendVerificationEmail(email, firstName, verificationCode);

    return NextResponse.json(
      { message: 'User Almost Created Please Verify' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
