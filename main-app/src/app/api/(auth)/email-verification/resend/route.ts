import crypto from "node:crypto";
import { generateOtp } from "@/helpers/generate-otp";
import dbConnect from "@/lib/config/db-connect";
import { handleApiError } from "@/lib/utils/error-handler";
import { logApiError } from "@/lib/utils/logger";
import {
  sendAppError,
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} from "@/lib/utils/response";
import { sanitizeEmail, validateAndSanitize } from "@/lib/utils/validators";
import { sendVerificationEmail } from "@/mail-templates";
import { UserAuthModel } from "@/models/users";
import { resendVerificationEmailSchema } from "@/zod/authValidation";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    const body = await req.json();
    const { email } = validateAndSanitize(body, resendVerificationEmailSchema);
    const sanitizedEmail = sanitizeEmail(email);

    // Check if user exists
    const userAuth = await UserAuthModel.findOne({ email: sanitizedEmail });
    if (!userAuth) {
      return sendNotFound("User not found", requestId);
    }

    // Check if user is already verified
    if (userAuth.isVerified) {
      return sendBadRequest("User already verified", undefined, requestId);
    }

    // Generate verification code
    const verificationCode = generateOtp();
    const verificationCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 5);

    // Update user auth
    userAuth.verificationCode = verificationCode;
    userAuth.verificationCodeExpiresAt = verificationCodeExpiresAt;
    await userAuth.save();

    // Send verification email
    await sendVerificationEmail(
      userAuth.email,
      userAuth.firstName,
      verificationCode,
    );

    return sendSuccess(
      "Verification code sent to email",
      { email: sanitizedEmail },
      requestId,
    );
  } catch (error) {
    logApiError("/api/email-verification/resend", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/email-verification/resend",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}
