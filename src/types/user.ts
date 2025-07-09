export type AuthMethod = 'email' | 'google' | 'facebook' | 'apple';
export type Theme = 'light' | 'dark' | 'system';
export type Font = 'sans' | 'serif' | 'mono' | 'system';

export interface SocialAccountUrl {
  url: string;
  provider: string;
}

export interface UserLocation {
  country: string;
  city: string;
  state: string;
  zipCode: string;
  address: string;
}

export interface User {
  _id: string;
  authUser: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar: string | null;
  location: UserLocation | null;
  socialAccounts: SocialAccountUrl[];
  bio: string | null;
  hasChangedUsername: boolean;
  dob: Date | null;
  preferences: {
    theme: Theme;
    font: Font;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAuth {
  _id: string;
  email: string;
  password: string;
  isVerified: boolean;
  authMethod: AuthMethod;
  verificationCode: string | null;
  verificationCodeExpiresAt: Date | null;
  resetPasswordToken: string | null;
  resetPasswordTokenExpiresAt: Date | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Auth-related interfaces
export interface AuthenticatedUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  preferences?: {
    theme: Theme;
    font: Font;
  };
  dob?: Date | null;
}

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

// User management interfaces
export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string | null;
  location: UserLocation | null;
  socialAccounts: SocialAccountUrl | null;
  bio: string | null;
  hasChangedUsername: boolean;
  preferences: {
    theme: Theme;
    font: Font;
  };
  dob: Date | null;
}

export interface UpdateUserDetailsRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
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
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteUserRequest {
  password: string;
}

export interface UserDetailsResponse {
  message: string;
  data: {
    user: UserProfile;
    preferences: {
      theme: string;
      font: string;
    };
    dob: Date | null;
  };
}
