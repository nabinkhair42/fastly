/**
 * Response Formatter Utility
 * Standardized API response format across the application
 */

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import type { AppError } from "./error-handler";

/**
 * Standard API Response interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
  timestamp: string;
  requestId: string;
}

/**
 * Error Response interface
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown[];
  timestamp: string;
  requestId: string;
}

/**
 * Create standardized API response object
 * @param statusCode - HTTP status code
 * @param message - Response message
 * @param data - Response data (optional)
 * @param errors - Error details (optional)
 * @param requestId - Request ID for tracking (optional)
 * @returns Standardized API response
 */
export const createResponse = <T = unknown>(
  statusCode: number,
  message: string,
  data?: T,
  errors?: unknown[],
  requestId?: string,
): ApiResponse<T> => {
  return {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    errors: errors && errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
    requestId: requestId || crypto.randomUUID(),
  };
};

/**
 * Create error response
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param errors - Error details (optional)
 * @param requestId - Request ID for tracking (optional)
 * @returns Error response
 */
export const createErrorResponse = (
  statusCode: number,
  message: string,
  errors?: unknown[],
  requestId?: string,
): ErrorResponse => {
  return {
    success: false,
    message,
    errors: errors && errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
    requestId: requestId || crypto.randomUUID(),
  };
};

/**
 * Send standardized API response
 * @param statusCode - HTTP status code
 * @param message - Response message
 * @param data - Response data (optional)
 * @param errors - Error details (optional)
 * @param requestId - Request ID for tracking (optional)
 * @returns NextResponse with standardized format
 */
export const sendResponse = <T = unknown>(
  statusCode: number,
  message: string,
  data?: T,
  errors?: unknown[],
  requestId?: string,
): NextResponse => {
  const response = createResponse(statusCode, message, data, errors, requestId);
  return NextResponse.json(response, { status: statusCode });
};

/**
 * Send error response
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param errors - Error details (optional)
 * @param requestId - Request ID for tracking (optional)
 * @returns NextResponse with error format
 */
export const sendErrorResponse = (
  statusCode: number,
  message: string,
  errors?: unknown[],
  requestId?: string,
): NextResponse => {
  const response = createErrorResponse(statusCode, message, errors, requestId);
  return NextResponse.json(response, { status: statusCode });
};

/**
 * Send AppError as response
 * @param error - AppError instance
 * @param requestId - Request ID for tracking (optional)
 * @returns NextResponse with error format
 */
export const sendAppError = (
  error: AppError,
  requestId?: string,
): NextResponse => {
  const errors = error.details ? [error.details] : undefined;
  return sendErrorResponse(error.statusCode, error.message, errors, requestId);
};

/**
 * Send success response (200 OK)
 */
export const sendSuccess = <T = unknown>(
  message: string,
  data?: T,
  requestId?: string,
): NextResponse => {
  return sendResponse(200, message, data, undefined, requestId);
};

/**
 * Send created response (201 Created)
 */
export const sendCreated = <T = unknown>(
  message: string,
  data?: T,
  requestId?: string,
): NextResponse => {
  return sendResponse(201, message, data, undefined, requestId);
};

/**
 * Send bad request response (400)
 */
export const sendBadRequest = (
  message: string,
  errors?: unknown[],
  requestId?: string,
): NextResponse => {
  return sendErrorResponse(400, message, errors, requestId);
};

/**
 * Send unauthorized response (401)
 */
export const sendUnauthorized = (
  message = "Unauthorized",
  requestId?: string,
): NextResponse => {
  return sendErrorResponse(401, message, undefined, requestId);
};

/**
 * Send forbidden response (403)
 */
export const sendForbidden = (
  message = "Forbidden",
  requestId?: string,
): NextResponse => {
  return sendErrorResponse(403, message, undefined, requestId);
};

/**
 * Send not found response (404)
 */
export const sendNotFound = (
  message = "Not found",
  requestId?: string,
): NextResponse => {
  return sendErrorResponse(404, message, undefined, requestId);
};

/**
 * Send conflict response (409)
 */
export const sendConflict = (
  message: string,
  errors?: unknown[],
  requestId?: string,
): NextResponse => {
  return sendErrorResponse(409, message, errors, requestId);
};

/**
 * Send server error response (500)
 */
export const sendServerError = (
  message = "Internal server error",
  requestId?: string,
): NextResponse => {
  return sendErrorResponse(500, message, undefined, requestId);
};

/**
 * Response helper object with all methods
 */
export const response = {
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
};

export default response;
