// src/hooks/auth/useLastUsedProvider.ts
'use client';

import { AuthMethod } from '@/types/user';
import { useCallback, useEffect, useState } from 'react';

const LAST_USED_PROVIDER_KEY = 'lastUsedOAuthProvider';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Helper function to set the last used provider cookie directly (for use in OAuth callbacks)
export const setLastUsedProviderCookie = (provider: AuthMethod) => {
  if (typeof window === 'undefined') return;

  document.cookie = `${LAST_USED_PROVIDER_KEY}=${provider}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
};

export const useLastUsedProvider = () => {
  const [lastUsedProvider, setLastUsedProvider] = useState<AuthMethod | null>(null);

  // Get last used provider from cookie
  const getLastUsedProvider = useCallback((): AuthMethod | null => {
    if (typeof window === 'undefined') return null;

    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${LAST_USED_PROVIDER_KEY}=`))
      ?.split('=')[1];

    return (cookieValue as AuthMethod) || null;
  }, []);

  // Set last used provider in cookie
  const setLastUsedProviderCookie = useCallback((provider: AuthMethod) => {
    if (typeof window === 'undefined') return;

    document.cookie = `${LAST_USED_PROVIDER_KEY}=${provider}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    setLastUsedProvider(provider);
  }, []);

  // Initialize on mount
  useEffect(() => {
    const stored = getLastUsedProvider();
    setLastUsedProvider(stored);
  }, [getLastUsedProvider]);

  return {
    lastUsedProvider,
    setLastUsedProvider: setLastUsedProviderCookie,
    isLastUsed: (provider: AuthMethod) => lastUsedProvider === provider,
  };
};
