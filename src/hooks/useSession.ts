'use client';

import { useAuth } from '@/providers/AuthProvider';

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
    status: isLoading
      ? 'loading'
      : isAuthenticated
        ? 'authenticated'
        : 'unauthenticated',
  };
};

/**
 * Type definitions for session data
 */
export interface SessionData {
  user: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  isGuest: boolean;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}
