import api from '@/lib/axios';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      username: string;
    };
  };
}

export interface CreateAccountRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface EmailVerificationRequest {
  email: string;
  verificationCode: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

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
  verifyEmail: async (
    data: EmailVerificationRequest
  ): Promise<LoginResponse> => {
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
