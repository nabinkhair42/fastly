/**
 * Validators Utility
 * Input validation and sanitization functions
 */

import type { ZodError, ZodSchema } from 'zod';

/**
 * Result type for validation
 */
export type ValidationResult<T> = { ok: true; data: T } | { ok: false; error: ZodError };

/**
 * Validate data against Zod schema
 * @param data - Data to validate
 * @param schema - Zod schema
 * @returns Validation result
 */
export const validate = <T>(data: unknown, schema: ZodSchema<T>): ValidationResult<T> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { ok: false, error: result.error };
  }
  return { ok: true, data: result.data };
};

/**
 * Validate and sanitize data
 * @param data - Data to validate and sanitize
 * @param schema - Zod schema
 * @returns Validated and sanitized data or throws error
 */
export const validateAndSanitize = <T>(data: unknown, schema: ZodSchema<T>): T => {
  const result = validate(data, schema);
  if (!result.ok) {
    throw result.error;
  }
  return result.data;
};

/**
 * Sanitize email address
 * @param email - Email to sanitize
 * @returns Sanitized email
 */
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Sanitize string input
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Validate email format
 * @param email - Email to validate
 * @returns True if valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @param options - Validation options
 * @returns Validation result with details
 */
export interface PasswordValidationOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

export const validatePassword = (
  password: string,
  options: PasswordValidationOptions = {}
): { valid: boolean; errors: string[] } => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate username
 * @param username - Username to validate
 * @returns True if valid username
 */
export const isValidUsername = (username: string): boolean => {
  // Username: 3-20 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validate URL
 * @param url - URL to validate
 * @returns True if valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate phone number (basic international format)
 * @param phone - Phone number to validate
 * @returns True if valid phone
 */
export const isValidPhone = (phone: string): boolean => {
  // Basic international phone format: +1-234-567-8900 or variations
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate UUID
 * @param uuid - UUID to validate
 * @returns True if valid UUID
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Sanitize object by removing dangerous fields
 * @param obj - Object to sanitize
 * @param dangerousFields - Fields to remove
 * @returns Sanitized object
 */
export const sanitizeObject = <T extends Record<string, unknown>>(
  obj: T,
  dangerousFields: string[] = ['password', 'token', 'secret', 'apiKey']
): Partial<T> => {
  const sanitized = { ...obj };
  for (const field of dangerousFields) {
    delete sanitized[field as keyof T];
  }
  return sanitized;
};

/**
 * Validators export object
 */
export const validators = {
  validate,
  validateAndSanitize,
  sanitizeEmail,
  sanitizeString,
  isValidEmail,
  validatePassword,
  isValidUsername,
  isValidUrl,
  isValidPhone,
  isValidUUID,
  sanitizeObject,
};

export default validators;
