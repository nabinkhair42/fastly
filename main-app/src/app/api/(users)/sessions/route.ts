import { requireAuth } from '@/lib/auth/auth-middleware';
import { markSessionRevoked } from '@/lib/auth/session-tracker';
import dbConnect from '@/lib/config/db-connect';
import { handleApiError } from '@/lib/utils/error-handler';
import { logApiError } from '@/lib/utils/logger';
import { sendAppError, sendNotFound, sendSuccess } from '@/lib/utils/response';
import { validateAndSanitize } from '@/lib/utils/validators';
import { UserSessionModel } from '@/models/user-sessions';
import type { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { z } from 'zod';

const revokeSessionSchema = z.object({
  sessionId: z.string().min(1, { message: 'Session ID is required' }),
});

/**
 * GET /api/(users)/sessions
 * Fetch all user sessions
 * @param request - NextRequest with authorization header
 * @returns List of user sessions
 */
export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response || sendAppError({
        message: 'Unauthorized',
        statusCode: 401,
        name: 'Unauthorized'
      }, crypto.randomUUID());
    }

    const sessions = await UserSessionModel.find({
      userAuth: authResult.user?.userId,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const serialized = sessions.map(session => ({
      sessionId: session.sessionId,
      authMethod: session.authMethod,
      userAgent: session.userAgent,
      browser: session.browser,
      os: session.os,
      device: session.device,
      ipAddress: session.ipAddress,
      location: session.location,
      createdAt: session.createdAt?.toISOString?.() ?? new Date().toISOString(),
      lastActiveAt:
        session.lastActiveAt?.toISOString?.() ??
        session.createdAt?.toISOString?.() ??
        new Date().toISOString(),
      revokedAt: session.revokedAt ? session.revokedAt.toISOString() : null,
    }));

    return sendSuccess('Sessions fetched successfully', { sessions: serialized }, requestId);
  } catch (error) {
    logApiError('/api/sessions', error, { method: 'GET' });
    const appError = handleApiError(error, {
      endpoint: '/api/sessions',
      method: 'GET',
    });
    return sendAppError(appError, requestId);
  }
}

/**
 * DELETE /api/(users)/sessions
 * Revoke a user session
 * @param request - NextRequest with authorization header and sessionId in body
 * @returns Revocation confirmation
 */
export async function DELETE(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response || sendAppError({
        message: 'Unauthorized',
        statusCode: 401,
        name: 'Unauthorized'
      }, crypto.randomUUID());
    }

    const payload = await request.json().catch(() => ({}));
    const { sessionId } = validateAndSanitize(payload, revokeSessionSchema);

    const session = await UserSessionModel.findOne({
      userAuth: authResult.user?.userId,
      sessionId,
    });

    if (!session) {
      return sendNotFound('Session not found', requestId);
    }

    if (session.revokedAt) {
      return sendSuccess(
        'Session already revoked',
        { message: 'Session was previously revoked' },
        requestId
      );
    }

    await markSessionRevoked(authResult.user!.userId, sessionId);

    return sendSuccess('Session revoked successfully', { sessionId }, requestId);
  } catch (error) {
    logApiError('/api/sessions', error, { method: 'DELETE' });
    const appError = handleApiError(error, {
      endpoint: '/api/sessions',
      method: 'DELETE',
    });
    return sendAppError(appError, requestId);
  }
}
