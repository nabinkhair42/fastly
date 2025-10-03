import { sendResponse } from '@/lib/apis/send-response';
import { requireAuth } from '@/lib/auth/auth-middleware';
import { markSessionRevoked } from '@/lib/auth/session-tracker';
import dbConnect from '@/lib/config/db-connect';
import { UserSessionModel } from '@/models/user-sessions';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const revokeSessionSchema = z.object({
  sessionId: z.string().min(1, { message: 'Session ID is required' }),
});

export async function GET(request: NextRequest) {
  await dbConnect();

  const authResult = await requireAuth(request);
  if (!authResult.success) {
    return authResult.response!;
  }

  const sessions = await UserSessionModel.find({
    userAuth: authResult.user!.userId,
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

  return sendResponse('Sessions fetched successfully', 200, {
    sessions: serialized,
  });
}

export async function DELETE(request: NextRequest) {
  await dbConnect();

  const authResult = await requireAuth(request);
  if (!authResult.success) {
    return authResult.response!;
  }

  const payload = await request.json().catch(() => ({}));
  const parsed = revokeSessionSchema.safeParse(payload);
  if (!parsed.success) {
    return sendResponse(parsed.error.message, 400);
  }

  const session = await UserSessionModel.findOne({
    userAuth: authResult.user!.userId,
    sessionId: parsed.data.sessionId,
  });

  if (!session) {
    return sendResponse('Session not found', 404);
  }

  if (session.revokedAt) {
    return sendResponse('Session already revoked', 200);
  }

  await markSessionRevoked(authResult.user!.userId, parsed.data.sessionId);

  return sendResponse('Session revoked successfully', 200);
}
