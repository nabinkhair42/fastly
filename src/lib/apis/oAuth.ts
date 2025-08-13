export const githubOAuth = {
  clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/github`,
};

export const googleOAuth = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/google`,
};

// Generate a secure random state parameter
const generateState = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// GitHub OAuth authorization URL
export const getGitHubAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: githubOAuth.clientId!,
    redirect_uri: githubOAuth.redirectUri!,
    scope: 'read:user user:email',
    state: state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

// Google OAuth authorization URL
export const getGoogleAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: googleOAuth.clientId!,
    redirect_uri: googleOAuth.redirectUri!,
    response_type: 'code',
    scope: 'openid email profile',
    state: state,
    access_type: 'offline', // Request refresh token
    prompt: 'consent', // Always show consent screen to get refresh token
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const GithubOAuthClickFunction = () => {
  const state = generateState();
  // Store state in localStorage for verification
  if (typeof window !== 'undefined') {
    localStorage.setItem('oauth_state', state);
  }
  const authUrl = getGitHubAuthUrl(state);
  window.location.href = authUrl;
};

export const GoogleOAuthClickFunction = () => {
  const state = generateState();
  // Store state in localStorage for verification
  if (typeof window !== 'undefined') {
    localStorage.setItem('oauth_state', state);
  }
  const authUrl = getGoogleAuthUrl(state);
  window.location.href = authUrl;
};
