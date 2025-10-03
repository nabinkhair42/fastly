import { authenticateToken } from '@/helpers/jwtToken';
import { sendResponse } from '@/lib/apis/send-response';
import { touchSession } from '@/lib/auth/session-tracker';
import dbConnect from '@/lib/config/db-connect';
import { UserAuthModel } from '@/models/users';
import type { AuthenticatedUser } from '@/types/user';
import { NextRequest } from 'next/server';

export interface AuthenticationResult {
  success: boolean;
  user?: AuthenticatedUser;
  response?: Response;
}

/**
 * Authenticate user from JWT token
 * Returns user data if valid, or error response if invalid
 */
export const authenticate = async (request: NextRequest): Promise<AuthenticationResult> => {
  try {
    // Extract and verify JWT token
    const decoded = authenticateToken(request);

    // Connect to database
    await dbConnect();

    // Verify user still exists and is verified
    const userAuth = await UserAuthModel.findById(decoded.userId);
    if (!userAuth) {
      return {
        success: false,
        response: sendResponse('User not found', 401),
      };
    }

    if (!userAuth.isVerified) {
      return {
        success: false,
        response: sendResponse('Account not verified', 403),
      };
    }

    const sessionId = request.headers.get('x-session-id');

    if (!sessionId) {
      return {
        success: false,
        response: sendResponse('Session context missing', 401),
      };
    }

    const activeSession = await touchSession(decoded.userId, sessionId);

    if (!activeSession) {
      return {
        success: false,
        response: sendResponse('Session revoked. Please log in again.', 401),
      };
    }

    return {
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        firstName: userAuth.firstName || '',
        lastName: userAuth.lastName || '',
        username: userAuth.username || '',
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';

    if (errorMessage.includes('No token provided')) {
      return {
        success: false,
        response: sendResponse('Authorization token required', 401),
      };
    }

    if (errorMessage.includes('Invalid or expired')) {
      return {
        success: false,
        response: sendResponse('Invalid or expired token', 401),
      };
    }

    return {
      success: false,
      response: sendResponse('Authentication failed', 401),
    };
  }
};

/**
 * Middleware wrapper for protected routes
 * Usage: const authResult = await requireAuth(request);
 */
export const requireAuth = async (request: NextRequest): Promise<AuthenticationResult> => {
  return await authenticate(request);
};

/**
 * Check if user can access resource (user must own the resource)
 */
export const authorizeUser = (authenticatedUserId: string, resourceUserId: string): boolean => {
  return authenticatedUserId === resourceUserId;
};
