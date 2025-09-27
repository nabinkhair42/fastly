'use client';

import { setLastUsedProviderCookie } from '@/hooks/auth/useLastUsedProvider';
import { sanitizeRedirect } from '@/hooks/auth/useSafeRedirect';
import { useAuth } from '@/providers/AuthProvider';
import { AuthMethod } from '@/types/user';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const OAuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const authMethod = searchParams.get('authMethod') as AuthMethod;
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      router.replace(`/log-in?error=${error}`);
      return;
    }

    if (accessToken && refreshToken) {
      try {
        const sessionIdFromParams = searchParams.get('sessionId') || undefined;
        let redirectTarget: string | undefined;
        if (typeof window !== 'undefined') {
          const storedRedirect = localStorage.getItem('oauth_redirect');
          if (storedRedirect) {
            redirectTarget = sanitizeRedirect(storedRedirect);
          }
          localStorage.removeItem('oauth_redirect');
        }
        const resolvedRedirect = redirectTarget ?? '/dashboard';

        // Get user data from URL parameters
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const firstName = searchParams.get('firstName') || '';
        const lastName = searchParams.get('lastName') || '';
        const username = searchParams.get('username') || '';

        if (userId && email) {
          const userData = {
            userId,
            email,
            firstName,
            lastName,
            username,
          };

          login(accessToken, refreshToken, userData, {
            sessionId: sessionIdFromParams,
          });

          // Set the last used OAuth provider if available
          if (
            authMethod &&
            (authMethod === AuthMethod.GITHUB ||
              authMethod === AuthMethod.GOOGLE)
          ) {
            setLastUsedProviderCookie(authMethod);
          }

          router.replace(resolvedRedirect);
        } else {
          // Fallback: decode JWT token for minimal data
          const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
          const userData = {
            userId: tokenPayload.userId,
            email: tokenPayload.email,
            firstName: '',
            lastName: '',
            username: '',
          };

          login(accessToken, refreshToken, userData, {
            sessionId: sessionIdFromParams,
          });

          // Set the last used OAuth provider if available
          if (
            authMethod &&
            (authMethod === AuthMethod.GITHUB ||
              authMethod === AuthMethod.GOOGLE)
          ) {
            setLastUsedProviderCookie(authMethod);
          }

          router.replace(resolvedRedirect);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.replace('/log-in?error=token_processing_failed');
      }
    } else {
      router.replace('/log-in?error=no_tokens');
    }
  }, [searchParams, router, login]);

  return (
    <div className="flex items-center justify-center min-h-[100svh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};
