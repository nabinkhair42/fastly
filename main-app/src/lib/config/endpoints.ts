/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all API routes
 */

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/log-in",
    CREATE_ACCOUNT: "/create-account",
    EMAIL_VERIFICATION: "/email-verification",
    EMAIL_VERIFICATION_RESEND: "/email-verification/resend",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
  },

  // User endpoints
  USER: {
    DETAILS: "/user-details",
    CHANGE_USERNAME: "/change-username",
    CHANGE_PASSWORD: "/change-password",
    DELETE_ACCOUNT: "/delete-user",
    UPLOAD_AVATAR: "/upload-avatar",
  },

  // Session endpoints
  SESSIONS: {
    GET_ALL: "/sessions",
    REVOKE: "/sessions",
  },
} as const;

/**
 * Auth endpoints that should skip 401 token refresh logic
 */
export const AUTH_ENDPOINTS = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.CREATE_ACCOUNT,
  API_ENDPOINTS.AUTH.EMAIL_VERIFICATION,
  API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
  API_ENDPOINTS.AUTH.RESET_PASSWORD,
] as const;

/**
 * Check if a URL is an auth endpoint
 */
export const isAuthEndpoint = (url?: string): boolean => {
  if (!url) {
    return false;
  }
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};
