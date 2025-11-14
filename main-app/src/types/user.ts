// ============================================
// Enums & Base Types
// ============================================

export enum AuthMethod {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
}

export type Theme = 'light' | 'dark' | 'system';
export type Font = 'sans' | 'serif' | 'mono' | 'system';

// ============================================
// Common Interfaces
// ============================================

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

export interface UserPreferences {
  theme: Theme;
  font: Font;
}

// ============================================
// Database Models
// ============================================

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

export interface User {
  _id: string;
  userAuth: string;
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
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// API Response Models
// ============================================

export interface AuthenticatedUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  preferences?: UserPreferences;
}

/** Merged User + UserAuth for API responses */
export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string | null;
  location: UserLocation | null;
  socialAccounts: SocialAccountUrl[];
  bio: string | null;
  hasChangedUsername?: boolean;
  preferences: UserPreferences;
  dob: Date | null;
  authMethod: AuthMethod;
  hasPassword?: boolean;
}
