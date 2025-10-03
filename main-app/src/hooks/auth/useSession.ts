'use client';

import { useAuth } from '@/providers/AuthProvider';
import { AuthenticatedUser } from '@/types/user';

/**
 * Type definitions for session data
 */
export interface SessionData {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  isGuest: boolean;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

/**
 * Hook to access session information
 * This is a simple wrapper around useAuth for cleaner API
 */
export const useSession = (): SessionData => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return {
    user,
    isAuthenticated,
    isLoading,
    // Helper computed properties
    isLoggedIn: isAuthenticated,
    isGuest: !isAuthenticated,
    status: isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated',
  };
};
