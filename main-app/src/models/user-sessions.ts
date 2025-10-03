import { AuthMethod } from '@/types/user';
import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema({
  userAuth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAuth',
    required: true,
    index: true,
  },
  sessionId: { type: String, required: true, unique: true },
  authMethod: {
    type: String,
    enum: Object.values(AuthMethod),
    required: true,
  },
  userAgent: { type: String, default: '' },
  browser: { type: String, default: '' },
  os: { type: String, default: '' },
  device: { type: String, default: '' },
  ipAddress: { type: String, default: '' },
  location: { type: String, default: null },
  createdAt: { type: Date, default: Date.now, immutable: true },
  lastActiveAt: { type: Date, default: Date.now },
  revokedAt: { type: Date, default: null },
});

export const UserSessionModel =
  mongoose.models.UserSession || mongoose.model('UserSession', userSessionSchema);
