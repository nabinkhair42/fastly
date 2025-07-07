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
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar: string;
  location: UserLocation;
  socialAccounts: SocialAccountUrl[];
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAuth {
  id: string;
  email: string;
  firstName: string;
  password: string;
  isVerified: boolean;
  authMethod: AuthMethod;
  verificationCode: string;
  resetPasswordToken: string;
  resetPasswordTokenExpiresAt: Date | null;
  verificationCodeExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
