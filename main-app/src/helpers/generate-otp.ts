import crypto from "node:crypto";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

/**
 * Generate cryptographically secure OTP
 * Uses crypto.randomBytes for better randomization than Math.random()
 * @returns 6-digit OTP string
 */
export const generateOtp = (): string => {
  // Generate random bytes and convert to number
  const buffer = crypto.randomBytes(3);
  const randomNum = buffer.readUIntBE(0, 3) % 1000000;

  // Pad with zeros to ensure 6 digits
  return randomNum.toString().padStart(OTP_LENGTH, "0");
};

/**
 * Generate OTP expiration time
 * @returns Date object representing expiration time (10 minutes from now)
 */
export const generateOtpExpiration = (): Date => {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
};
