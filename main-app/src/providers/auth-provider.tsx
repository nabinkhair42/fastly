"use client";

import { tokenManager } from "@/lib/config/axios";
import type { AuthenticatedUser } from "@/types/user";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    user: AuthenticatedUser,
    options?: { sessionId?: string },
  ) => void;
  logout: () => void;
  updateUser: (user: AuthenticatedUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  USER: "user",
  SESSION_ID: "sessionId",
} as const;

const API_ENDPOINTS = {
  SESSIONS: "/api/sessions",
  LOGOUT: "/api/auth/logout",
} as const;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const accessToken = tokenManager.getAccessToken();
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (accessToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        tokenManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    (
      accessToken: string,
      refreshToken: string,
      userData: AuthenticatedUser,
      options?: { sessionId?: string },
    ) => {
      tokenManager.setTokens(accessToken, refreshToken, options?.sessionId);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      if (options?.sessionId) {
        localStorage.setItem(STORAGE_KEYS.SESSION_ID, options.sessionId);
      }
      setUser(userData);
    },
    [],
  );

  const logout = useCallback(() => {
    const accessToken = tokenManager.getAccessToken();
    const sessionId = tokenManager.getSessionId();

    tokenManager.clearTokens();
    setUser(null);

    // Revoke session
    if (sessionId && accessToken) {
      fetch(API_ENDPOINTS.SESSIONS, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
        body: JSON.stringify({ sessionId }),
      }).catch(() => {
        // Silently fail - user is already logged out locally
      });
    }

    // Invalidate tokens on server
    if (accessToken) {
      fetch(API_ENDPOINTS.LOGOUT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          ...(sessionId ? { "X-Session-Id": sessionId } : {}),
        },
      }).catch(() => {
        // Silently fail - user is already logged out locally
      });
    }
  }, []);

  const updateUser = useCallback((updatedUser: AuthenticatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  }, []);

  const isAuthenticated = useMemo(
    () => !!user && !!tokenManager.getAccessToken(),
    [user],
  );

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, isAuthenticated, isLoading, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
