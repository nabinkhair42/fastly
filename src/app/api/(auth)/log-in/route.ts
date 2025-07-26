import { verifyPassword } from '@/helpers/hashPassword';
import { generateTokenPair } from '@/helpers/jwtToken';
import dbConnect from '@/lib/dbConnect';
import { sendResponse } from '@/lib/sendResponse';
import { UserAuthModel } from '@/models/users';
import { loginSchema } from '@/zod/authValidation';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email, password } = await request.json();
    const { error } = loginSchema.safeParse({ email, password });

    if (error) {
      return sendResponse(error.message, 400);
    }

    // check if user exists
    const userAuth = await UserAuthModel.findOne({ email });
    if (!userAuth) {
      return sendResponse(
        'User not found, Please create an account to continue',
        401
      );
    }

    // check if user was created with OAuth (no password)
    if (!userAuth.password) {
      const authMethod =
        userAuth.authMethod.charAt(0).toUpperCase() +
        userAuth.authMethod.slice(1);
      return sendResponse(
        `This account was created with ${authMethod}. Please use ${authMethod} to login.`,
        401
      );
    }

    // check if password is correct
    if (!password || !userAuth.password) {
      return sendResponse('Incorrect password, please try again', 401);
    }

    // verify password
    const isPasswordCorrect = await verifyPassword(password, userAuth.password);
    if (!isPasswordCorrect) {
      return sendResponse('Incorrect password, please try again', 401);
    }

    // check if user is verified
    if (!userAuth.isVerified) {
      return sendResponse(
        'Please verify your email address before logging in. Check your email for verification code.',
        403
      );
    }

    // generate secure token pair
    const tokens = generateTokenPair(userAuth._id.toString(), userAuth.email);

    return sendResponse('Login successful', 200, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: userAuth._id,
        email: userAuth.email,
        isVerified: userAuth.isVerified,
      },
    });
  } catch (error: unknown) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse(errorMessage, 500, null, error);
  }
}
