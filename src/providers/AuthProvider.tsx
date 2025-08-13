'use client';

import { tokenManager } from '@/lib/config/axios';
import { AuthenticatedUser } from '@/types/user';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    user: AuthenticatedUser
  ) => void;
  logout: () => void;
  updateUser: (user: AuthenticatedUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const accessToken = tokenManager.getAccessToken();
        const storedUser = localStorage.getItem('user');

        if (accessToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear invalid data
        tokenManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (
    accessToken: string,
    refreshToken: string,
    userData: AuthenticatedUser
  ) => {
    tokenManager.setTokens(accessToken, refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // Get token before clearing it
    const accessToken = tokenManager.getAccessToken();

    tokenManager.clearTokens();
    setUser(null);

    // Optional: Call logout API to invalidate tokens on server
    // This is fire-and-forget, don't wait for response
    if (accessToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }).catch(() => {
        // Ignore errors, user is logging out anyway
      });
    }
  };

  const updateUser = (updatedUser: AuthenticatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!user && !!tokenManager.getAccessToken();

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
