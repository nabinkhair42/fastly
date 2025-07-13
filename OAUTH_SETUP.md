# OAuth Setup Guide

This guide will help you set up GitHub and Google OAuth applications for your Next.js application.

## Prerequisites

1. Copy `.env.example` to `.env.local`
2. Fill in your database and JWT secrets
3. Set `NEXTAUTH_URL` to your application URL (e.g., `http://localhost:3000` for development)

## GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your app name (e.g., "My Next.js App")
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"

### Step 2: Get GitHub Credentials

1. After creating the app, you'll see the **Client ID**
2. Click "Generate a new client secret" to get the **Client Secret**
3. Add these to your `.env.local`:
   ```
   GITHUB_CLIENT_ID=your_github_client_id_here
   GITHUB_CLIENT_SECRET=your_github_client_secret_here
   ```

### Step 3: Configure Scopes

The app requests the following GitHub scopes:

- `user:email` - Access to user's email addresses

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)

### Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: Your application name
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue

### Step 3: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Configure:
   - **Name**: Your app name
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
5. Click "Create"

### Step 4: Get Google Credentials

1. Copy the **Client ID** and **Client Secret**
2. Add these to your `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```

## Production Setup

### For Production Deployment:

1. **GitHub OAuth App**:
   - Update Homepage URL to your production domain
   - Update Authorization callback URL to `https://yourdomain.com/api/auth/callback/github`

2. **Google OAuth App**:
   - Add your production domain to Authorized JavaScript origins
   - Add `https://yourdomain.com/api/auth/callback/google` to Authorized redirect URIs

3. **Environment Variables**:
   - Update `NEXTAUTH_URL` to your production URL
   - Ensure all secrets are properly set in your deployment platform

## Testing OAuth Integration

1. Start your development server: `npm run dev`
2. Go to the login page: `http://localhost:3000/log-in`
3. Click the GitHub or Google OAuth buttons
4. You should be redirected to the respective OAuth provider
5. After authorization, you should be redirected back and logged in

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**:
   - Check that your callback URLs match exactly in your OAuth app settings

2. **"invalid_client" error**:
   - Verify your client ID and secret are correct in `.env.local`

3. **CORS errors**:
   - Ensure your domain is added to authorized origins in Google Console

4. **OAuth app not found**:
   - Make sure your GitHub OAuth app is active and not suspended

### Debug Tips:

1. Check browser network tab for failed requests
2. Verify environment variables are loaded correctly
3. Check server logs for detailed error messages
4. Ensure your OAuth apps are configured for the correct environment (dev/prod)

## Security Notes

1. Never commit your `.env.local` file to version control
2. Use different OAuth apps for development and production
3. Regularly rotate your client secrets
4. Monitor OAuth app usage in respective developer consoles
5. Keep your dependencies updated for security patches
