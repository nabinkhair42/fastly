import { requireAuth } from '@/lib/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import { sendResponse } from '@/lib/sendResponse';
import { UserAuthModel } from '@/models/users';
import {
  canLoginWithEmail,
  getUserLoginMethods,
} from '@/services/accountLinkingService';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    // Find user auth by authenticated user ID
    const userAuth = await UserAuthModel.findById(authResult.user!.userId);
    if (!userAuth) {
      return sendResponse('User not found', 404);
    }

    return sendResponse('User auth status fetched successfully', 200, {
      hasPassword: userAuth.hasPassword,
      canLoginWithEmail: canLoginWithEmail(userAuth),
      availableLoginMethods: getUserLoginMethods(userAuth),
      isVerified: userAuth.isVerified,
      lastLoginProvider: userAuth.lastLoginProvider,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
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
