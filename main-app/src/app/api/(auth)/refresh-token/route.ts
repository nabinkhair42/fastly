import { generateTokenPair, verifyRefreshToken } from '@/helpers/jwt-token';
import { sendResponse } from '@/lib/apis/send-response';
import { touchSession } from '@/lib/auth/session-tracker';
import dbConnect from '@/lib/config/db-connect';
import { UserAuthModel } from '@/models/users';
import { refreshTokenSchema } from '@/zod/authValidation';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { refreshToken } = await request.json();

    // Validate request
    const { error } = refreshTokenSchema.safeParse({ refreshToken });
    if (error) {
      return sendResponse(error.message, 400);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if user still exists and is verified
    const userAuth = await UserAuthModel.findById(decoded.userId);
    if (!userAuth) {
      return sendResponse('User not found', 401);
    }

    if (!userAuth.isVerified) {
      return sendResponse('Account not verified', 403);
    }

    const sessionId = request.headers.get('x-session-id');
    if (!sessionId) {
      return sendResponse('Session context missing', 401);
    }

    const activeSession = await touchSession(decoded.userId, sessionId);
    if (!activeSession) {
      return sendResponse('Session revoked. Please log in again.', 401);
    }

    // Generate new token pair
    const tokens = generateTokenPair(userAuth._id.toString(), userAuth.email);

    return sendResponse('Tokens refreshed successfully', 200, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: userAuth._id,
        email: userAuth.email,
        isVerified: userAuth.isVerified,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid or expired')) {
        return sendResponse('Invalid or expired refresh token', 401);
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse(errorMessage, 500, null, error);
  }
}
