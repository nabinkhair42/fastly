export type AuthMethod = 'email' | 'google' | 'facebook' | 'github';
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
}

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
  preferences: {
    theme: Theme;
    font: Font;
  };
  dob: Date | null;
}
