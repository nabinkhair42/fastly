/**
 * Cookie Manager Utility
 * Centralized cookie operations for OAuth provider tracking
 */

import type { AuthMethod } from "@/types/user";

const LAST_USED_PROVIDER_KEY = "lastUsedOAuthProvider";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Check if code is running in browser
 */
const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * Set last used OAuth provider cookie
 * @param provider - OAuth provider name (EMAIL, GITHUB, GOOGLE)
 */
export const setLastUsedProviderCookie = (provider: AuthMethod): void => {
  if (!isBrowser()) {
    return;
  }
  document.cookie = `${LAST_USED_PROVIDER_KEY}=${provider}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
};

/**
 * Get last used OAuth provider from cookie
 * @returns Last used provider or null if not found
 */
export const getLastUsedProvider = (): AuthMethod | null => {
  if (!isBrowser()) {
    return null;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LAST_USED_PROVIDER_KEY}=`))
    ?.split("=")[1];

  return (cookieValue as AuthMethod) || null;
};

/**
 * Clear last used provider cookie
 */
export const clearLastUsedProvider = (): void => {
  if (!isBrowser()) {
    return;
  }
  document.cookie = `${LAST_USED_PROVIDER_KEY}=; path=/; max-age=0; SameSite=Lax`;
};
