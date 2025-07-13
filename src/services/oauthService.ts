import axios from 'axios';

export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility?: string;
}

// GitHub OAuth Configuration
export const githubConfig: OAuthConfig = {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
  scope: 'user:email',
};

// Google OAuth Configuration
export const googleConfig: OAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
  scope: 'openid email profile',
};

/**
 * Generate OAuth authorization URL
 */
export function generateAuthUrl(
  provider: 'github' | 'google',
  state?: string
): string {
  const config = provider === 'github' ? githubConfig : googleConfig;
  const baseUrl =
    provider === 'github'
      ? 'https://github.com/login/oauth/authorize'
      : 'https://accounts.google.com/o/oauth2/v2/auth';

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: 'code',
    ...(state && { state }),
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  provider: 'github' | 'google',
  code: string
): Promise<string> {
  const config = provider === 'github' ? githubConfig : googleConfig;

  if (provider === 'github') {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (response.data.error) {
      throw new Error(`GitHub OAuth error: ${response.data.error_description}`);
    }

    return response.data.access_token;
  } else {
    // Google OAuth
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
    });

    if (response.data.error) {
      throw new Error(`Google OAuth error: ${response.data.error_description}`);
    }

    return response.data.access_token;
  }
}

/**
 * Fetch user data from OAuth provider
 */
export async function fetchOAuthUser(
  provider: 'github' | 'google',
  accessToken: string
): Promise<OAuthUser> {
  if (provider === 'github') {
    // Fetch user data from GitHub
    const [userResponse, emailResponse] = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }),
      axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }),
    ]);

    const user = userResponse.data;
    const emails = emailResponse.data;
    const primaryEmail =
      emails.find((email: GitHubEmail) => email.primary)?.email || user.email;

    const nameParts = (user.name || '').split(' ');

    return {
      id: user.id.toString(),
      email: primaryEmail,
      name: user.name || user.login,
      avatar: user.avatar_url,
      firstName: nameParts[0] || user.login,
      lastName: nameParts.slice(1).join(' ') || '',
    };
  } else {
    // Fetch user data from Google
    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const user = response.data;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.picture,
      firstName: user.given_name || '',
      lastName: user.family_name || '',
    };
  }
}

/**
 * Complete OAuth flow: exchange code for token and fetch user data
 */
export async function completeOAuthFlow(
  provider: 'github' | 'google',
  code: string
): Promise<OAuthUser> {
  const accessToken = await exchangeCodeForToken(provider, code);
  return await fetchOAuthUser(provider, accessToken);
}
