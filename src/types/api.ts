import { AuthenticatedUser, SocialAccountUrl, UserProfile } from '@/types/user';

// Authentication API interfaces
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
    user: AuthenticatedUser;
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

export interface AuthResponse {
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      isVerified: boolean;
    };
  };
}

// User Management API interfaces
export interface UpdateUserDetailsRequest {
  firstName?: string;
  lastName?: string;
  bio?: string | null;
  socialAccounts?: SocialAccountUrl[];
  preferences?: {
    theme?: string;
    font?: string;
  };
  dob?: Date;
}

export interface ChangeUsernameRequest {
  username: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteUserRequest {
  password?: string;
}

export interface UserDetailsResponse {
  message: string;
  data: {
    user: UserProfile;
  };
}

export interface AvatarUploadResponse {
  message: string;
  data?: {
    avatar: string;
  };
}
