/**
 * Error Handler Utility
 * Centralized error handling and custom error classes
 */

import { ZodError } from "zod";
import { logger } from "./logger";

/**
 * Custom App Error class
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Not Found Error class
 */
export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 404, details);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Unauthorized Error class
 */
export class UnauthorizedError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 401, details);
    this.name = "UnauthorizedError";
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Forbidden Error class
 */
export class ForbiddenError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 403, details);
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Conflict Error class (409)
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, details);
    this.name = "ConflictError";
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Rate Limit Error class (429)
 */
export class RateLimitError extends AppError {
  constructor(message: string, retryAfter?: number) {
    super(message, 429, { retryAfter });
    this.name = "RateLimitError";
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Handle API errors and convert to standardized format
 * @param error - The error to handle
 * @param context - Additional context for logging
 * @returns Standardized AppError
 */
export const handleApiError = (
  error: unknown,
  context?: { endpoint?: string; userId?: string; method?: string },
): AppError => {
  // If already an AppError, return as is
  if (error instanceof AppError) {
    logger.error(`API Error: ${context?.endpoint}`, error, context);
    return error;
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationErrors = (error as ZodError).issues.map((err: unknown) => {
      const issue = err as {
        path: (string | number)[];
        message: string;
        code: string;
      };
      return {
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      };
    });
    logger.error(`Validation Error: ${context?.endpoint}`, error, {
      validationErrors,
    });
    return new ValidationError("Validation failed", {
      errors: validationErrors,
    });
  }

  // Handle standard Error
  if (error instanceof Error) {
    const message = error.message || "An error occurred";
    logger.error(`Error: ${context?.endpoint}`, error, context);

    // Check for specific error patterns
    if (message.includes("token") || message.toLowerCase().includes("jwt")) {
      return new UnauthorizedError("Invalid or expired token");
    }
    if (message.includes("not found")) {
      return new NotFoundError(message);
    }
    if (message.includes("already exists")) {
      return new ConflictError(message);
    }

    return new AppError(message, 500, { originalError: error });
  }

  // Handle unknown errors
  const unknownError = new AppError("An unexpected error occurred", 500, error);
  logger.error(`Unknown Error: ${context?.endpoint}`, error, context);
  return unknownError;
};

/**
 * Extract error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

/**
 * Extract error details from various error types
 */
export const getErrorDetails = (error: unknown): unknown => {
  if (error instanceof AppError) {
    return error.details;
  }
  if (error instanceof ZodError) {
    return (error as ZodError).issues;
  }
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  return error;
};

/**
 * Check if error is a client error (4xx)
 */
export const isClientError = (error: AppError): boolean => {
  return error.statusCode >= 400 && error.statusCode < 500;
};

/**
 * Check if error is a server error (5xx)
 */
export const isServerError = (error: AppError): boolean => {
  return error.statusCode >= 500;
};

/**
 * Safe error handler - catches and converts any error
 */
export const safeErrorHandler = (error: unknown): AppError => {
  try {
    return handleApiError(error);
  } catch (handlerError) {
    logger.error("Error handler failed", handlerError);
    return new AppError("An unexpected error occurred", 500);
  }
};

const errorHandlerExport = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  RateLimitError,
  handleApiError,
  getErrorMessage,
  getErrorDetails,
  isClientError,
  isServerError,
  safeErrorHandler,
};

export default errorHandlerExport;
