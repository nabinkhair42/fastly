import { generateTokenPair } from '@/helpers/jwt-token';
import { googleOAuth } from '@/lib/apis/oauth';
import { createUserSession } from '@/lib/auth/session-tracker';
import dbConnect from '@/lib/config/db-connect';
import { sendWelcomeEmail } from '@/mail-templates/email-service';
import { UserAuthModel, UserModel } from '@/models/users';
import { AuthMethod } from '@/types/user';
import { NextRequest, NextResponse } from 'next/server';

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=oauth_cancelled`
      );
    }

    // Validate required parameters
    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=missing_code`);
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: googleOAuth.clientId!,
        client_secret: googleOAuth.clientSecret!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: googleOAuth.redirectUri!,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Google token exchange failed:', errorText);

      // Try to parse error details
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error === 'invalid_grant') {
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=invalid_grant`
          );
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=token_exchange_failed`
      );
    }

    const tokenData: GoogleTokenResponse = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=no_access_token`
      );
    }

    // Get user data from Google
    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`
    );

    if (!userResponse.ok) {
      console.error('Google user data fetch failed:', await userResponse.text());
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=user_data_fetch_failed`
      );
    }

    const googleUser: GoogleUser = await userResponse.json();

    if (!googleUser.verified_email) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=email_not_verified`
      );
    }

    // Check if user already exists
    let userAuth = await UserAuthModel.findOne({ email: googleUser.email });

    if (userAuth) {
      // User exists, check if they used Google auth before
      if (userAuth.authMethod !== AuthMethod.GOOGLE) {
        const existingMethod =
          userAuth.authMethod.charAt(0).toUpperCase() + userAuth.authMethod.slice(1);
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=use_${userAuth.authMethod}_login&method=${existingMethod}`
        );
      }
    } else {
      // Create new user with robust data handling
      const firstName = googleUser.given_name || googleUser.name?.split(' ')[0] || 'User';
      const lastName =
        googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '';

      try {
        // Create auth user
        userAuth = await UserAuthModel.create({
          firstName: firstName,
          lastName: lastName,
          email: googleUser.email,
          password: '', // No password for OAuth users
          isVerified: true, // Google users are pre-verified
          authMethod: AuthMethod.GOOGLE,
        });

        // Create user profile
        await UserModel.create({
          userAuth: userAuth._id,
          firstName: firstName,
          lastName: lastName,
          email: googleUser.email,
          username: googleUser.email.split('@')[0], // Use email prefix as username
          avatar: googleUser.picture,
        });
      } catch (dbError) {
        console.error('Database error creating user:', dbError);
        throw dbError;
      }
    }

    // Get user profile data
    const userProfile = await UserModel.findOne({ userAuth: userAuth._id });

    // Generate JWT tokens
    const tokens = generateTokenPair(userAuth._id.toString(), userAuth.email);

    const session = await createUserSession({
      userAuthId: userAuth._id.toString(),
      authMethod: AuthMethod.GOOGLE,
      request,
    });

    // Redirect to OAuth callback page with tokens and user data
    const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/oauth-callback`);
    redirectUrl.searchParams.set('accessToken', tokens.accessToken);
    redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);
    redirectUrl.searchParams.set('authMethod', AuthMethod.GOOGLE);
    redirectUrl.searchParams.set('sessionId', session.sessionId);
    redirectUrl.searchParams.set('sessionCreatedAt', session.createdAt.toISOString());

    // Include user data in URL params
    redirectUrl.searchParams.set('userId', userAuth._id.toString());
    redirectUrl.searchParams.set('email', userAuth.email);
    redirectUrl.searchParams.set('firstName', userAuth.firstName || '');
    redirectUrl.searchParams.set('lastName', userAuth.lastName || '');
    redirectUrl.searchParams.set('username', userProfile?.username || '');

    // Send welcome email if new user
    if (userAuth && userAuth.isVerified && userProfile) {
      await sendWelcomeEmail(userAuth.email, userAuth.firstName || '');
    }

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=oauth_error`);
  }
}
