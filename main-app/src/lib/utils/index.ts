/**
 * Utils Index
 * Centralized exports for all utility modules
 */

// Logger
export {
  logger,
  logRequest,
  logApiError,
  logAuthEvent,
  logPerformance,
} from "./logger";

// Error Handler
export {
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
} from "./error-handler";

// Response Formatter
export {
  createResponse,
  createErrorResponse,
  sendResponse,
  sendErrorResponse,
  sendAppError,
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendConflict,
  sendServerError,
  response,
} from "./response";
export type { ApiResponse, ErrorResponse } from "./response";

// Validators
export {
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
  validators,
} from "./validators";
export type { ValidationResult, PasswordValidationOptions } from "./validators";

// Cookie Manager
export {
  setLastUsedProviderCookie,
  getLastUsedProvider,
  clearLastUsedProvider,
} from "./cookie-manager";
