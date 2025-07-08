export type AuthMethod = 'email' | 'google' | 'facebook' | 'apple';

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
  hasChangedUsername: boolean; // Track if username has been changed
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
  // Temporary fields used only during account creation (cleared after verification)
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
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

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
}
