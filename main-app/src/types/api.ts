import type {
  AuthenticatedUser,
  SocialAccountUrl,
  UserLocation,
  UserProfile,
} from "@/types/user";

// ============================================
// Authentication API Types
// ============================================

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    session?: {
      sessionId: string;
      createdAt: string;
      browser: string;
      os: string;
      device: string;
      ipAddress: string;
    };
    user: AuthenticatedUser;
  };
}

// Request types (inline for single-field interfaces)
export type LoginRequest = {
  email: string;
  password: string;
};

export type CreateAccountRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type EmailVerificationRequest = {
  email: string;
  verificationCode: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  email: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

// ============================================
// User Management API Types
// ============================================

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
  location?: Partial<UserLocation> | null;
}

export type ChangeUsernameRequest = {
  username: string;
};

export type ChangePasswordRequest = {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
};

export type DeleteUserRequest = {
  password?: string;
};

export type RevokeSessionRequest = {
  sessionId: string;
};

// ============================================
// Response Types
// ============================================

export type UserDetailsResponse = {
  message: string;
  data: {
    user: UserProfile;
  };
};

export type AvatarUploadResponse = {
  message: string;
  data?: {
    avatar: string;
  };
};

export type SessionData = {
  _id: string;
  sessionId: string;
  authMethod: string;
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  ipAddress: string;
  location: string | null;
  createdAt: string;
  lastActiveAt: string;
  revokedAt: string | null;
};

export type SessionsResponse = {
  success: boolean;
  message: string;
  data: {
    sessions: SessionData[];
  };
};
