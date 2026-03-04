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

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const accessToken = tokenManager.getAccessToken();
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (accessToken && storedUser) {
          const parsed = JSON.parse(storedUser);
          // Basic validation that parsed data has required fields
          if (parsed && typeof parsed === "object" && parsed.email) {
            setUser(parsed);
            setHasToken(true);
          } else {
            tokenManager.clearTokens();
            localStorage.removeItem(STORAGE_KEYS.USER);
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        tokenManager.clearTokens();
        localStorage.removeItem(STORAGE_KEYS.USER);
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
      setHasToken(true);
    },
    [],
  );

  const logout = useCallback(() => {
    tokenManager.clearTokens();
    setUser(null);
    setHasToken(false);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
  }, []);

  const updateUser = useCallback((updatedUser: AuthenticatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  }, []);

  const isAuthenticated = useMemo(
    () => !!user && hasToken,
    [user, hasToken],
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
