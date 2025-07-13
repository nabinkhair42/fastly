import { generateAuthUrl } from '@/services/oauthService';
import { sendResponse } from '@/lib/sendResponse';
import { NextRequest } from 'next/server';

/**
 * Google OAuth Authorization
 * GET /api/auth/google
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirectTo') || '/dashboard';

    // Generate state parameter for security (prevents CSRF)
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString(
      'base64'
    );

    // Generate Google OAuth authorization URL
    const authUrl = generateAuthUrl('google', state);

    // Redirect user to Google for authorization
    return Response.redirect(authUrl);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse('OAuth initialization failed', 500, null, errorMessage);
  }
}
