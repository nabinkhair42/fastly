import { generateOtp } from '@/helpers/generateOtp';
import dbConnect from '@/lib/dbConnect';
import { sendResponse } from '@/lib/sendResponse';
import { sendVerificationEmail } from '@/mail-templates/emailService';
import { handleEmailSignUp } from '@/services/accountLinkingService';
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

    // check if password and confirm password match
    if (password !== confirmPassword) {
      return sendResponse('Password and confirm password do not match', 400);
    }

    // Additional validation to ensure required fields are present
    if (!firstName?.trim() || !lastName?.trim()) {
      return sendResponse('First name and last name are required', 400);
    }

    // Use Auth0 standard account linking service
    const { user, linkedProvider } = await handleEmailSignUp(
      email,
      password,
      firstName.trim(),
      lastName.trim()
    );

    // generate verification code for email verification
    const verificationCode = generateOtp();
    const verificationCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 5);

    // Update user with verification code
    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = verificationCodeExpiresAt;
    await user.save();

    // send verification email
    await sendVerificationEmail(email, firstName, verificationCode);

    let message =
      'Account created successfully. Please check your email for verification code.';
    if (linkedProvider) {
      message = `Email/password login added to your existing account. Please check your email for verification code.`;
    }

    return sendResponse(message, 201);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Handle specific account linking errors
      if (error.message === 'Account with this email already exists') {
        return sendResponse(error.message, 400);
      }
      return sendResponse('Internal Server Error', 500, null, error.message);
    }
    return sendResponse(
      'Internal Server Error',
      500,
      null,
      'Unknown error occurred'
    );
  }
}
