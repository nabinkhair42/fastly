import { AuthMethod, type User, type UserAuth } from "@/types/user";
import mongoose from "mongoose";

const userAuthSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false },
    isVerified: { type: Boolean, default: false, index: true },
    authMethod: { type: String, default: AuthMethod.EMAIL },
    verificationCode: { type: String, default: null },
    verificationCodeExpiresAt: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const UserAuthModel =
  mongoose.models.UserAuth ||
  mongoose.model<UserAuth>("UserAuth", userAuthSchema);

const userSchema = new mongoose.Schema(
  {
    userAuth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
      index: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false, default: "" },
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    avatar: { type: String, default: null },
    location: { type: Object, default: null },
    socialAccounts: { type: Array, default: [] },
    bio: { type: String, default: null },
    hasChangedUsername: { type: Boolean, default: false },
    preferences: {
      theme: { type: String, default: "system" },
      font: { type: String, default: "system" },
    },
    dob: { type: Date, default: null },
  },
  { timestamps: true },
);

export const UserModel =
  mongoose.models.User || mongoose.model<User>("User", userSchema);
