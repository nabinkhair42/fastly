import { generateTokenPair } from '@/helpers/jwtToken';
import { sendResponse } from '@/lib/apis/sendResponse';
import { createUserSession } from '@/lib/auth/sessionTracker';
import dbConnect from '@/lib/config/dbConnect';
import { sendWelcomeEmail } from '@/mail-templates/emailService';
import { UserAuthModel, UserModel } from '@/models/users';
import { verifyEmailSchema } from '@/zod/authValidation';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { verificationCode, email } = await request.json();
    const { error } = verifyEmailSchema.safeParse({ verificationCode, email });

    if (error) {
      return sendResponse(error.message, 400);
    }

    // Check both email AND verification code
    const userAuth = await UserAuthModel.findOne({
      email,
      verificationCode,
    });
    if (!userAuth) {
      return sendResponse('Invalid verification code or email', 400);
    }

    // check if verification code has expired
    if (userAuth.verificationCodeExpiresAt && userAuth.verificationCodeExpiresAt < new Date()) {
      return sendResponse('Verification code has expired', 400);
    }

    // check if user is already verified
    if (userAuth.isVerified) {
      return sendResponse('User already verified', 400);
    }

    // Validate that required user data exists
    if (!userAuth.firstName || !userAuth.lastName) {
      return sendResponse(
        'Account creation failed: Missing required user information. Please create account again.',
        400
      );
    }

    // create user with data from userAuth
    await UserModel.create({
      authUser: userAuth._id,
      firstName: userAuth.firstName,
      lastName: userAuth.lastName,
      email: userAuth.email,
      username: `${userAuth.firstName.toLowerCase()}_${Date.now()}`,
    });

    // verify user and clear verification data
    userAuth.isVerified = true;
    userAuth.verificationCode = null;
    userAuth.verificationCodeExpiresAt = null;
    await userAuth.save();

    // generate secure token pair
    const tokens = generateTokenPair(userAuth._id.toString(), userAuth.email);

    const session = await createUserSession({
      userAuthId: userAuth._id.toString(),
      authMethod: userAuth.authMethod,
      request,
    });

    // send welcome email
    await sendWelcomeEmail(userAuth.email, userAuth.firstName);

    return sendResponse('Email verified successfully', 200, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      session: {
        sessionId: session.sessionId,
        createdAt: session.createdAt.toISOString(),
        browser: session.browser,
        os: session.os,
        device: session.device,
        ipAddress: session.ipAddress,
      },
      user: {
        id: userAuth._id,
        email: userAuth.email,
        isVerified: userAuth.isVerified,
        firstName: userAuth.firstName,
        lastName: userAuth.lastName,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse(errorMessage, 500, null, error);
  }
}
