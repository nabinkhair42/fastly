import { User, UserAuth } from '@/types/user';
import mongoose from 'mongoose';

const authUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  authMethod: { type: String, default: 'email' },
  verificationCode: { type: String, default: null },
  verificationCodeExpiresAt: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordTokenExpiresAt: { type: Date, default: null },
  // Temporary fields for account creation (moved to User model during verification)
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
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
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel =
  mongoose.models.User || mongoose.model<User>('User', userSchema);
