'use client';

import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UseRequireAuthOptions {
  redirectTo?: string;
  enabled?: boolean;
}

/**
 * Hook that ensures user is authenticated
 * Redirects to login if not authenticated
 */
export const useRequireAuth = (options: UseRequireAuthOptions = {}) => {
  const { redirectTo = '/log-in', enabled = true } = options;
  const { isAuthenticated, isLoading, user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (enabled && !isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [enabled, isAuthenticated, isLoading, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    user,
    isReady: !isLoading && isAuthenticated,
  };
};

/**
 * Hook that redirects authenticated users away from auth pages
 * Useful for login/signup pages that authenticated users shouldn't access
 */
export const useRedirectIfAuthenticated = (redirectTo: string = '/') => {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    shouldShow: !isLoading && !isAuthenticated,
  };
};

/**
 * Hook for conditional authentication checks
 * More flexible than useRequireAuth for custom logic
 */
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading, user, status } = useSession();
  const router = useRouter();

  const requireAuth = (redirectTo: string = '/log-in') => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
      return false;
    }
    return isAuthenticated;
  };

  const redirectIfAuthenticated = (redirectTo: string = '/') => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
      return false;
    }
    return !isAuthenticated;
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    status,
    requireAuth,
    redirectIfAuthenticated,
    isReady: !isLoading,
  };
};
