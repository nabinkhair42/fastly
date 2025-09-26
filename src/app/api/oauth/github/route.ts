import { generateTokenPair } from '@/helpers/jwtToken';
import { githubOAuth } from '@/lib/apis/oAuth';
import dbConnect from '@/lib/config/dbConnect';
import { UserAuthModel, UserModel } from '@/models/users';
import { AuthMethod } from '@/types/user';
import { NextRequest, NextResponse } from 'next/server';

interface GitHubUser {
  id: number;
  login: string;
  email: string;
  name: string;
  avatar_url: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
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
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=missing_code`
      );
    }

    // Note: State verification would typically be done on the client side
    // by comparing the returned state with the one stored in localStorage
    // For server-side verification, you'd need to store state in a session or database

    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: githubOAuth.clientId,
          client_secret: githubOAuth.clientSecret,
          code: code,
          redirect_uri: githubOAuth.redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      console.error(
        'GitHub token exchange failed:',
        await tokenResponse.text()
      );
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=token_exchange_failed`
      );
    }

    const tokenData: GitHubTokenResponse = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=no_access_token`
      );
    }

    // Get user data from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    console.log('userResponse from github', userResponse);

    if (!userResponse.ok) {
      console.error(
        'GitHub user data fetch failed:',
        await userResponse.text()
      );
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=user_data_fetch_failed`
      );
    }

    const githubUser: GitHubUser = await userResponse.json();

    // Get user's email from GitHub
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    let primaryEmail = githubUser.email;
    if (emailsResponse.ok) {
      const emails: GitHubEmail[] = await emailsResponse.json();
      const primaryEmailObj = emails.find(email => email.primary);
      if (primaryEmailObj) {
        primaryEmail = primaryEmailObj.email;
      }
    }

    if (!primaryEmail) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=no_email_access`
      );
    }

    // Check if user already exists
    let userAuth = await UserAuthModel.findOne({ email: primaryEmail });

    if (userAuth) {
      // User exists, check if they used GitHub auth before
      if (userAuth.authMethod !== AuthMethod.GITHUB) {
        const existingMethod =
          userAuth.authMethod.charAt(0).toUpperCase() +
          userAuth.authMethod.slice(1);
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=use_${userAuth.authMethod}_login&method=${existingMethod}`
        );
      }
    } else {
      // Create new user
      const [firstName, ...lastNameParts] = (
        githubUser.name || githubUser.login
      ).split(' ');
      const lastName = lastNameParts.join(' ') || '';

      // Create auth user
      userAuth = await UserAuthModel.create({
        firstName: firstName || '',
        lastName: lastName || '',
        email: primaryEmail,
        password: '', // No password for OAuth users
        isVerified: true, // GitHub users are pre-verified
        authMethod: AuthMethod.GITHUB,
      });

      // Create user profile
      await UserModel.create({
        authUser: userAuth._id,
        firstName: firstName || '',
        lastName: lastName || '',
        email: primaryEmail,
        username: githubUser.login,
        avatar: githubUser.avatar_url,
      });
    }

    // Get user profile data
    const userProfile = await UserModel.findOne({ authUser: userAuth._id });

    // Generate JWT tokens
    const tokens = generateTokenPair(userAuth._id.toString(), userAuth.email);

    // Redirect to OAuth callback page with tokens and user data
    const redirectUrl = new URL(
      `${process.env.NEXT_PUBLIC_APP_URL}/oauth-callback`
    );
    redirectUrl.searchParams.set('accessToken', tokens.accessToken);
    redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);
    redirectUrl.searchParams.set('authMethod', AuthMethod.GITHUB);

    // Include user data in URL params
    redirectUrl.searchParams.set('userId', userAuth._id.toString());
    redirectUrl.searchParams.set('email', userAuth.email);
    redirectUrl.searchParams.set('firstName', userAuth.firstName || '');
    redirectUrl.searchParams.set('lastName', userAuth.lastName || '');
    redirectUrl.searchParams.set('username', userProfile?.username || '');

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/log-in?error=oauth_error`
    );
  }
}
