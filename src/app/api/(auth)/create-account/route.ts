import { generateOtp } from '@/helpers/generateOtp';
import { hashPassword } from '@/helpers/hashPassword';
import { sendResponse } from '@/lib/apis/sendResponse';
import dbConnect from '@/lib/config/dbConnect';
import { sendVerificationEmail } from '@/mail-templates/emailService';
import { UserAuthModel } from '@/models/users';
import { createAccountSchema } from '@/zod/authValidation';
import { NextRequest } from 'next/server';

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
      return sendResponse(error.message, 400);
    }

    // check if user already exists
    const existingUser = await UserAuthModel.findOne({ email });
    if (existingUser) {
      const existingUserAuthMethod =
        (existingUser?.authMethod).charAt(0).toUpperCase() +
        (existingUser?.authMethod).slice(1);

      return sendResponse(
        `User already exists with ${existingUserAuthMethod} method`,
        400
      );
    }

    // check if password and confirm password match
    if (password !== confirmPassword) {
      return sendResponse('Password and confirm password do not match', 400);
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // generate verification code
    const verificationCode = generateOtp();

    // generate verification code expires at
    const verificationCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 5);

    // Additional validation to ensure required fields are present
    if (!firstName?.trim() || !lastName?.trim()) {
      return sendResponse('First name and last name are required', 400);
    }

    // create user auth with temporary user details
    await UserAuthModel.create({
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    // send verification email
    await sendVerificationEmail(email, firstName, verificationCode);

    return sendResponse(
      'Account created successfully. Please check your email for verification code.',
      201
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return sendResponse(error.message, 500, null, error);
    }
    return sendResponse('Unknown error occurred', 500, null, error);
  }
}
