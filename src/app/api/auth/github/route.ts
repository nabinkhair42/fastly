import { generateAuthUrl } from '@/services/oauthService';
import { sendResponse } from '@/lib/sendResponse';
import { NextRequest } from 'next/server';

/**
 * GitHub OAuth Authorization
 * GET /api/auth/github
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirectTo') || '/dashboard';

    // Generate state parameter for security (prevents CSRF)
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString(
      'base64'
    );

    // Generate GitHub OAuth authorization URL
    const authUrl = generateAuthUrl('github', state);

    // Redirect user to GitHub for authorization
    return Response.redirect(authUrl);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse('OAuth initialization failed', 500, null, errorMessage);
  }
}
