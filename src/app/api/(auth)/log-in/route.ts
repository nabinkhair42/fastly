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
      return sendResponse('Invalid email or password', 401);
    }

    // check if password is correct
    const isPasswordCorrect = await verifyPassword(password, userAuth.password);
    if (!isPasswordCorrect) {
      return sendResponse('Invalid email or password', 401);
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
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse('Internal Server Error', 500, null, errorMessage);
  }
}
