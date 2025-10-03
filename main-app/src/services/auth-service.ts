import api from '@/lib/config/axios';
import {
  CreateAccountRequest,
  EmailVerificationRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from '@/types/api';

// Auth Service Functions
export const authService = {
  // Login user
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/log-in', data);
    return response.data;
  },

  // Create new account
  createAccount: async (data: CreateAccountRequest) => {
    const response = await api.post('/create-account', data);
    return response.data;
  },

  // Verify email with OTP
  verifyEmail: async (data: EmailVerificationRequest): Promise<LoginResponse> => {
    const response = await api.post('/email-verification', data);
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email: string) => {
    const response = await api.post('/email-verification/resend', {
      email,
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await api.post('/forgot-password', data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await api.post('/reset-password', data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (data: RefreshTokenRequest): Promise<LoginResponse> => {
    const response = await api.post('/refresh-token', data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
};
