"use client";

import {
  getLastUsedProvider,
  setLastUsedProviderCookie,
} from "@/lib/utils/cookie-manager";
import type { AuthMethod } from "@/types/user";
import { useCallback, useState } from "react";

/**
 * Hook to manage last used OAuth provider
 * Persists provider choice in cookies for better UX
 */
export const useLastUsedProvider = () => {
  // Initialize directly from cookie (sync read, no useEffect needed)
  const [lastUsedProvider, setLastUsedProvider] = useState<AuthMethod | null>(
    () => getLastUsedProvider(),
  );

  // Set provider and persist to cookie
  const handleSetProvider = useCallback((provider: AuthMethod) => {
    setLastUsedProviderCookie(provider);
    setLastUsedProvider(provider);
  }, []);

  return {
    lastUsedProvider,
    setLastUsedProvider: handleSetProvider,
    isLastUsed: (provider: AuthMethod) => lastUsedProvider === provider,
  };
};

// Export utility for direct use in OAuth callbacks
export { setLastUsedProviderCookie } from "@/lib/utils/cookie-manager";
