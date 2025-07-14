import { requireAuth } from '@/lib/authMiddleware';
import { sendResponse } from '@/lib/sendResponse';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user to ensure they have a valid token
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    // Since we don't have a token blacklist database, we'll rely on client-side token removal
    // In a production environment, you would:
    // 1. Add the token to a blacklist database/Redis
    // 2. Check blacklist in authentication middleware
    // 3. Clean up expired blacklisted tokens periodically

    return sendResponse('Logged out successfully', 200);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse(errorMessage, 500, null, error);
  }
}
