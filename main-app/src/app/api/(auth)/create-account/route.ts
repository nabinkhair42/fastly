import crypto from "node:crypto";
import { generateOtp } from "@/helpers/generate-otp";
import { hashPassword } from "@/helpers/hash-password";
import dbConnect from "@/lib/config/db-connect";
import { handleApiError } from "@/lib/utils/error-handler";
import { logApiError, logAuthEvent } from "@/lib/utils/logger";
import {
  sendAppError,
  sendBadRequest,
  sendConflict,
  sendCreated,
} from "@/lib/utils/response";
import { sanitizeEmail, validateAndSanitize } from "@/lib/utils/validators";
import { sendVerificationEmail } from "@/mail-templates";
import { UserAuthModel } from "@/models/users";
import { createAccountSchema } from "@/zod/authValidation";
import type { NextRequest } from "next/server";

/**
 * POST /api/create-account
 * Create a new user account with email and password
 * @param request - NextRequest with account details in body
 * @returns Account creation response with verification email sent
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const { firstName, lastName, email, password, confirmPassword } =
      validateAndSanitize(body, createAccountSchema);
    const sanitizedEmail = sanitizeEmail(email);

    // Check if user already exists
    const existingUser = await UserAuthModel.findOne({ email: sanitizedEmail });
    if (existingUser) {
      const authMethod =
        existingUser.authMethod.charAt(0).toUpperCase() +
        existingUser.authMethod.slice(1);
      logAuthEvent("failed_login", undefined, {
        reason: "user_exists",
        email: sanitizedEmail,
      });
      return sendConflict(
        `User already exists with ${authMethod} authentication method`,
        undefined,
        requestId,
      );
    }

    // Verify password and confirm password match
    if (password !== confirmPassword) {
      return sendBadRequest("Passwords do not match", undefined, requestId);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification code
    const verificationCode = generateOtp();
    const verificationCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Trim and validate names
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    // Create user account
    const newUser = await UserAuthModel.create({
      email: sanitizedEmail,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      authMethod: "email",
    });

    // Send verification email
    await sendVerificationEmail(
      sanitizedEmail,
      trimmedFirstName,
      verificationCode,
    );

    // Log signup event
    logAuthEvent("signup", newUser._id.toString(), { provider: "email" });

    // Return success response
    return sendCreated(
      "Account created successfully. Please check your email for verification code.",
      {
        userId: newUser._id,
        email: newUser.email,
        message: "Verification email sent",
      },
      requestId,
    );
  } catch (error) {
    logApiError("/api/create-account", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/create-account",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}
