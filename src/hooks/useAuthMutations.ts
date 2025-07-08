'use client';

import { useAuth } from '@/providers/AuthProvider';
import {
  authService,
  CreateAccountRequest,
  EmailVerificationRequest,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
} from '@/services/authService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Login mutation
export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: response => {
      const { accessToken, refreshToken, user } = response.data;
      login(accessToken, refreshToken, user);
      toast.success('Login successful!');
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
    mutationFn: (data: CreateAccountRequest) => authService.createAccount(data),
    onSuccess: response => {
      toast.success(
        response.message ||
          'Account created successfully! Please check your email for verification.'
      );
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
export const useVerifyEmail = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: EmailVerificationRequest) =>
      authService.verifyEmail(data),
    onSuccess: response => {
      const { accessToken, refreshToken, user } = response.data;
      login(accessToken, refreshToken, user);
      toast.success('Email verified successfully! Welcome aboard!');
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
    mutationFn: (email: string) => authService.resendVerification(email),
    onSuccess: response => {
      toast.success(
        response.message || 'Verification email sent successfully!'
      );
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
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
    onSuccess: response => {
      toast.success(
        response.message || 'Password reset email sent successfully!'
      );
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
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: response => {
      toast.success(
        response.message ||
          'Password reset successfully! You can now login with your new password.'
      );
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
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all cached queries
      toast.success('Logged out successfully!');
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      // Even if logout API fails, we should still clear local state
      logout();
      queryClient.clear();
      const message = error.response?.data?.message || 'Logout completed';
      toast.success(message);
    },
  });
};
