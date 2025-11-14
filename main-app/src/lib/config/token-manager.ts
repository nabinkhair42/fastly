/**
 * Token Manager
 * Handles all token-related operations with localStorage
 */

const TOKEN_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  SESSION_ID: "sessionId",
  USER: "user",
} as const;

/**
 * Check if code is running in browser environment
 */
const isBrowser = (): boolean => typeof window !== "undefined";

export const tokenManager = {
  /**
   * Get access token from localStorage
   */
  getAccessToken: (): string | null => {
    if (!isBrowser()) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken: (): string | null => {
    if (!isBrowser()) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  },

  /**
   * Get session ID from localStorage
   */
  getSessionId: (): string | null => {
    if (!isBrowser()) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEYS.SESSION_ID);
  },

  /**
   * Set tokens in localStorage
   */
  setTokens: (
    accessToken: string,
    refreshToken: string,
    sessionId?: string,
  ): void => {
    if (!isBrowser()) {
      return;
    }
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    if (sessionId) {
      localStorage.setItem(TOKEN_KEYS.SESSION_ID, sessionId);
    }
  },

  /**
   * Clear all tokens and user data from localStorage
   */
  clearTokens: (): void => {
    if (!isBrowser()) {
      return;
    }
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER);
    localStorage.removeItem(TOKEN_KEYS.SESSION_ID);
  },

  /**
   * Check if user has valid tokens
   */
  hasValidTokens: (): boolean => {
    return !!tokenManager.getAccessToken() && !!tokenManager.getRefreshToken();
  },
};
