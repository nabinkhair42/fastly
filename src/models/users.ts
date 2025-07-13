import type { User, UserAuth } from '@/types/user';
import mongoose from 'mongoose';

const authUserSchema = new mongoose.Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null }, // Made optional for OAuth users
  hasPassword: { type: Boolean, default: false }, // Track if user has password
  isVerified: { type: Boolean, default: false },
  authMethod: { type: String, default: 'email' }, // Keep for backward compatibility

  // Auth0 standard: Multiple identity providers per user
  identities: [
    {
      provider: { type: String, required: true }, // 'email', 'github', 'google'
      providerId: { type: String, required: true }, // OAuth ID or email for email provider
      providerEmail: { type: String, required: true },
      isVerified: { type: Boolean, default: false },
      isPrimary: { type: Boolean, default: false }, // First identity is primary
      linkedAt: { type: Date, default: Date.now },
    },
  ],

  verificationCode: { type: String, default: null },
  verificationCodeExpiresAt: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordTokenExpiresAt: { type: Date, default: null },
  lastLoginAt: { type: Date, default: null },
  lastLoginProvider: { type: String, default: null }, // Track last used provider
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});

export const UserAuthModel =
  mongoose.models.UserAuth ||
  mongoose.model<UserAuth>('UserAuth', authUserSchema);

const userSchema = new mongoose.Schema({
  authUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAuth',
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  avatar: { type: String, default: null },
  location: { type: Object, default: null },
  socialAccounts: { type: Array, default: [] },
  bio: { type: String, default: null },
  hasChangedUsername: { type: Boolean, default: false }, // Track if username has been changed
  preferences: {
    theme: { type: String, default: 'system' },
    font: { type: String, default: 'system' },
  },
  dob: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel =
  mongoose.models.User || mongoose.model<User>('User', userSchema);
