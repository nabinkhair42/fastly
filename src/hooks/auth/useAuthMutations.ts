'use client';

import { setLastUsedProviderCookie } from '@/hooks/auth/useLastUsedProvider';
import { useAuth } from '@/providers/AuthProvider';
import { authService } from '@/services/authService';
import {
  CreateAccountRequest,
  EmailVerificationRequest,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
} from '@/types/api';
import { AuthMethod } from '@/types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Login mutation
export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      return toast.promise(authService.login(data), {
        loading: 'Logging in...',
        success: 'Login successful!',
        error: 'Login failed. Please try again.',
      });
    },
    onSuccess: response => {
      const { accessToken, refreshToken, user } = response.data;
      login(accessToken, refreshToken, user);
      // Set email as the last used authentication method
      setLastUsedProviderCookie(AuthMethod.EMAIL);
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    },
  });
};

// Create account mutation
export const useCreateAccount = () => {
  return useMutation({
    mutationFn: async (data: CreateAccountRequest) => {
      return toast.promise(authService.createAccount(data), {
        loading: 'Creating account...',
        success: response =>
          response.message ||
          'Account created successfully! Please check your email for verification.',
        error: 'Account creation failed. Please try again.',
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        'Account creation failed. Please try again.';
      toast.error(message);
    },
  });
};

// Email verification mutation
export const useVerifyEmail = (onSuccessCallback?: () => void) => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: EmailVerificationRequest) => {
      return toast.promise(authService.verifyEmail(data), {
        loading: 'Verifying email...',
        success: 'Email verified successfully! Welcome aboard!',
        error: 'Email verification failed. Please try again.',
      });
    },
    onSuccess: response => {
      const { accessToken, refreshToken, user } = response.data;
      login(accessToken, refreshToken, user);
      // Set email as the last used authentication method
      setLastUsedProviderCookie(AuthMethod.EMAIL);
      // Call the callback after auth state is updated
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        'Email verification failed. Please try again.';
      toast.error(message);
    },
  });
};

// Resend verification mutation
export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return toast.promise(authService.resendVerification(email), {
        loading: 'Sending verification email...',
        success: response =>
          response.message || 'Verification email sent successfully!',
        error: 'Failed to send verification email. Please try again.',
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        'Failed to resend verification email. Please try again.';
      toast.error(message);
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      return toast.promise(authService.forgotPassword(data), {
        loading: 'Sending password reset email...',
        success: response =>
          response.message || 'Password reset email sent successfully!',
        error: 'Failed to send password reset email. Please try again.',
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        'Failed to send password reset email. Please try again.';
      toast.error(message);
    },
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      return toast.promise(authService.resetPassword(data), {
        loading: 'Resetting password...',
        success: response =>
          response.message ||
          'Password reset successfully! You can now login with your new password.',
        error: 'Password reset failed. Please try again.',
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        'Password reset failed. Please try again.';
      toast.error(message);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return toast.promise(authService.logout(), {
        loading: 'Logging out...',
        success: 'Logged out successfully!',
        error: 'Logout failed. Please try again.',
      });
    },
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all cached queries
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      // Even if logout API fails, we should still clear local state
      logout();
      queryClient.clear();
      const message = error.response?.data?.message || 'Logout completed';
      toast.error(message);
    },
  });
};
