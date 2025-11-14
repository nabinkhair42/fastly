import { AuthMethod } from "@/types/user";
import mongoose, { type Document, type Schema } from "mongoose";

export interface IUserSession extends Document {
  userAuth: Schema.Types.ObjectId;
  sessionId: string;
  authMethod: AuthMethod;
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  ipAddress: string;
  location: string | null;
  createdAt: Date;
  lastActiveAt: Date;
  revokedAt: Date | null;
}

const userSessionSchema = new mongoose.Schema<IUserSession>(
  {
    userAuth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
      index: true,
    },
    sessionId: { type: String, required: true, unique: true, index: true },
    authMethod: {
      type: String,
      enum: Object.values(AuthMethod),
      required: true,
    },
    userAgent: { type: String, default: "" },
    browser: { type: String, default: "" },
    os: { type: String, default: "" },
    device: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    location: { type: String, default: null },
    lastActiveAt: { type: Date, default: Date.now },
    revokedAt: { type: Date, default: null, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Add compound index for efficient queries
userSessionSchema.index({ userAuth: 1, revokedAt: 1 });

export const UserSessionModel =
  mongoose.models.UserSession ||
  mongoose.model<IUserSession>("UserSession", userSessionSchema);
