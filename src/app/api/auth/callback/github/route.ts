import { completeOAuthFlow } from '@/services/oauthService';
import {
  handleOAuthSignIn,
  generateAuthTokens,
} from '@/services/accountLinkingService';
import dbConnect from '@/lib/dbConnect';
import { NextRequest } from 'next/server';

/**
 * GitHub OAuth Callback Handler
 * GET /api/auth/callback/github
 */
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      const errorDescription =
        searchParams.get('error_description') || 'OAuth authorization failed';
      return Response.redirect(
        `${process.env.NEXTAUTH_URL}/log-in?error=${encodeURIComponent(errorDescription)}`
      );
    }

    if (!code) {
      return Response.redirect(
        `${process.env.NEXTAUTH_URL}/log-in?error=${encodeURIComponent('Authorization code not received')}`
      );
    }

    // Parse state parameter
    let redirectTo = '/dashboard';
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        redirectTo = stateData.redirectTo || '/dashboard';
      } catch {
        // Invalid state, use default redirect
      }
    }

    // Complete OAuth flow: exchange code for user data
    const oauthUser = await completeOAuthFlow('github', code);

    // Handle account linking with Auth0 standard
    const { user, isNewUser, linkedProvider } = await handleOAuthSignIn(
      'github',
      oauthUser
    );

    // Generate JWT tokens
    const tokens = generateAuthTokens(user);

    // Create success URL with tokens
    const successUrl = new URL(`${process.env.NEXTAUTH_URL}/auth/callback`);
    successUrl.searchParams.set('accessToken', tokens.accessToken);
    successUrl.searchParams.set('refreshToken', tokens.refreshToken);
    successUrl.searchParams.set(
      'user',
      JSON.stringify({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.email.split('@')[0], // Temporary username
      })
    );
    successUrl.searchParams.set('redirectTo', redirectTo);

    if (isNewUser) {
      successUrl.searchParams.set('isNewUser', 'true');
    }
    if (linkedProvider) {
      successUrl.searchParams.set('linkedProvider', linkedProvider);
    }

    return Response.redirect(successUrl.toString());
  } catch (error: unknown) {
    console.error('GitHub OAuth callback error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'OAuth authentication failed';
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/log-in?error=${encodeURIComponent(errorMessage)}`
    );
  }
}
