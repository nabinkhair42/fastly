import mongoose from 'mongoose';
import { UserAuth, User } from '@/types/user';

const authUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  authMethod: { type: String, default: 'email' },
  verificationCode: { type: String, default: null },
  verificationCodeExpiresAt: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordTokenExpiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});

export const UserAuthModel = mongoose.model<UserAuth>(
  'UserAuth',
  authUserSchema
);

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
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<User>('User', userSchema);
