/**
 * Axios Interceptors
 * Handles request and response interceptor logic
 */

import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_ENDPOINTS, isAuthEndpoint } from "./endpoints";
import { tokenManager } from "./token-manager";

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

/**
 * Setup request interceptor
 * Adds authorization headers to all requests
 */
export const setupRequestInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenManager.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const sessionId = tokenManager.getSessionId();
      if (sessionId && config.headers) {
        config.headers["X-Session-Id"] = sessionId;
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );
};

/**
 * Handle session revocation
 */
const handleSessionRevocation = (message?: string): void => {
  if (!message) {
    return;
  }

  const normalizedMessage = message.toLowerCase();
  if (
    normalizedMessage.includes("session revoked") ||
    normalizedMessage.includes("session context missing")
  ) {
    tokenManager.clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/log-in";
    }
  }
};

/**
 * Attempt to refresh access token
 */
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const sessionId = tokenManager.getSessionId();
    const response = await axios.post(
      `/api${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
      { refreshToken },
      {
        headers: sessionId
          ? {
              "X-Session-Id": sessionId,
            }
          : undefined,
      },
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    const existingSessionId = tokenManager.getSessionId();
    tokenManager.setTokens(
      accessToken,
      newRefreshToken,
      existingSessionId ?? undefined,
    );

    return accessToken;
  } catch {
    tokenManager.clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/log-in";
    }
    return null;
  }
};

/**
 * Setup response interceptor
 * Handles errors and token refresh logic
 */
export const setupResponseInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableConfig;
      const responseStatus = error.response?.status;
      const serverMessage = (
        error.response?.data as { message?: string } | undefined
      )?.message;

      // Handle session revocation
      if (responseStatus === 401) {
        handleSessionRevocation(serverMessage);
      }

      // Skip 401 handling for auth endpoints
      if (
        responseStatus === 401 &&
        !originalRequest._retry &&
        !isAuthEndpoint(originalRequest.url)
      ) {
        originalRequest._retry = true;

        const newAccessToken = await refreshAccessToken();
        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      }

      return Promise.reject(error);
    },
  );
};
