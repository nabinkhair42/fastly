"use client";

import { useSession } from "@/hooks/auth/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type AuthGuardType =
  | "require"
  | "redirect-if-auth"
  | "redirect-to-dashboard"
  | "flexible";

interface UseAuthGuardOptions {
  type?: AuthGuardType;
  redirectTo?: string;
  enabled?: boolean;
  userDetails?: unknown;
}

/**
 * Unified authentication guard hook
 * Replaces 4 separate hooks with single flexible implementation
 *
 * @param options - Configuration options
 * @param options.type - Guard type: 'require' | 'redirect-if-auth' | 'redirect-to-dashboard' | 'flexible'
 * @param options.redirectTo - URL to redirect to (default: '/log-in' for require, '/' for redirect-if-auth)
 * @param options.enabled - Enable/disable the guard (default: true)
 * @param options.userDetails - User details for redirect-to-dashboard type
 *
 * @example
 * // Require authentication
 * const { isReady } = useAuthGuard({ type: 'require' });
 *
 * @example
 * // Redirect if already authenticated
 * const { shouldShow } = useAuthGuard({ type: 'redirect-if-auth' });
 *
 * @example
 * // Flexible manual checks
 * const { requireAuth, redirectIfAuthenticated } = useAuthGuard({ type: 'flexible' });
 */
export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const {
    type = "flexible",
    redirectTo,
    enabled = true,
    userDetails,
  } = options;

  const { isAuthenticated, isLoading, user, status } = useSession();
  const router = useRouter();

  // Handle 'require' type - redirect to login if not authenticated
  useEffect(() => {
    if (type !== "require" || !enabled || isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push(redirectTo || "/log-in");
    }
  }, [type, enabled, isLoading, isAuthenticated, router, redirectTo]);

  // Handle 'redirect-if-auth' type - redirect to home if authenticated
  useEffect(() => {
    if (type !== "redirect-if-auth" || !enabled || isLoading) {
      return;
    }

    if (isAuthenticated) {
      router.push(redirectTo || "/");
    }
  }, [type, enabled, isLoading, isAuthenticated, router, redirectTo]);

  // Handle 'redirect-to-dashboard' type - redirect to dashboard when authenticated
  useEffect(() => {
    if (type !== "redirect-to-dashboard" || !enabled || isLoading) {
      return;
    }

    if (isAuthenticated && userDetails) {
      router.push(redirectTo || "/dashboard");
    }
  }, [
    type,
    enabled,
    isLoading,
    isAuthenticated,
    userDetails,
    router,
    redirectTo,
  ]);

  // Flexible methods for manual checks
  const requireAuth = (customRedirectTo = "/log-in"): boolean => {
    if (!isLoading && !isAuthenticated) {
      router.push(customRedirectTo);
      return false;
    }
    return isAuthenticated;
  };

  const redirectIfAuthenticated = (customRedirectTo = "/"): boolean => {
    if (!isLoading && isAuthenticated) {
      router.push(customRedirectTo);
      return false;
    }
    return !isAuthenticated;
  };

  return {
    // State
    isAuthenticated,
    isLoading,
    user,
    status,

    // Computed
    isReady: !isLoading && isAuthenticated,
    shouldShow: !isLoading && (!isAuthenticated || !enabled),
    shouldRedirect: !isLoading && isAuthenticated && userDetails,

    // Methods for flexible type
    requireAuth,
    redirectIfAuthenticated,
  };
};

// Backward compatibility exports
/**
 * @deprecated Use useAuthGuard({ type: 'require' }) instead
 */
export const useRequireAuth = (
  options: { redirectTo?: string; enabled?: boolean } = {},
) => {
  return useAuthGuard({ type: "require", ...options });
};

/**
 * @deprecated Use useAuthGuard({ type: 'redirect-if-auth' }) instead
 */
export const useRedirectIfAuthenticated = (
  redirectTo = "/",
  options: { enabled?: boolean } = {},
) => {
  return useAuthGuard({ type: "redirect-if-auth", redirectTo, ...options });
};

/**
 * @deprecated Use useAuthGuard({ type: 'redirect-to-dashboard' }) instead
 */
export const useAuthRedirect = (userDetails: unknown) => {
  return useAuthGuard({ type: "redirect-to-dashboard", userDetails });
};
