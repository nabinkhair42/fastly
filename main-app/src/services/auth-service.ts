import api from "@/lib/config/axios";
import { API_ENDPOINTS } from "@/lib/config/endpoints";
import type {
  AuthResponse,
  CreateAccountRequest,
  EmailVerificationRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from "@/types/api";

// Auth Service Functions
export const authService = {
  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  // Create new account
  createAccount: async (data: CreateAccountRequest) => {
    const response = await api.post(API_ENDPOINTS.AUTH.CREATE_ACCOUNT, data);
    return response.data;
  },

  // Verify email with OTP
  verifyEmail: async (
    data: EmailVerificationRequest,
  ): Promise<AuthResponse> => {
    const response = await api.post(
      API_ENDPOINTS.AUTH.EMAIL_VERIFICATION,
      data,
    );
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email: string) => {
    const response = await api.post(
      API_ENDPOINTS.AUTH.EMAIL_VERIFICATION_RESEND,
      {
        email,
      },
    );
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
};
