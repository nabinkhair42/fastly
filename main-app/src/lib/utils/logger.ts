/**
 * Logger Utility
 * Centralized structured logging for the application
 * Supports different log levels: info, warn, error, debug
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  error?: unknown;
}

/**
 * Format log message with timestamp and level
 */
const formatLog = (level: LogLevel, message: string): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

/**
 * Create log context object
 */
const createLogContext = (
  level: LogLevel,
  message: string,
  data?: unknown,
  error?: unknown,
): LogContext => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
    error,
  };
};

/**
 * Logger utility object with different log levels
 *
 * @example
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to fetch user', error);
 * logger.warn('High memory usage detected', { memory: '95%' });
 * logger.debug('Processing request', { requestId: 'abc-123' });
 */
export const logger = {
  /**
   * Log informational message
   */
  info: (message: string, data?: unknown): void => {
    const formatted = formatLog("info", message);
    console.log(formatted, data);
  },

  /**
   * Log warning message
   */
  warn: (message: string, data?: unknown): void => {
    const formatted = formatLog("warn", message);
    console.warn(formatted, data);
  },

  /**
   * Log error message
   */
  error: (message: string, error?: unknown, data?: unknown): void => {
    const formatted = formatLog("error", message);
    const errorContext = data ? { error, ...data } : { error };
    console.error(formatted, errorContext);
  },

  /**
   * Log debug message (only in development)
   */
  debug: (message: string, data?: unknown): void => {
    if (
      process.env.DEBUG === "true" ||
      process.env.NODE_ENV === "development"
    ) {
      const formatted = formatLog("debug", message);
      console.debug(formatted, data);
    }
  },

  /**
   * Get log context object (useful for structured logging)
   */
  getContext: (
    level: LogLevel,
    message: string,
    data?: unknown,
    error?: unknown,
  ): LogContext => {
    return createLogContext(level, message, data, error);
  },
};

/**
 * Request logger - logs HTTP requests
 */
export const logRequest = (
  method: string,
  path: string,
  userId?: string,
  statusCode?: number,
): void => {
  const userInfo = userId ? ` (User: ${userId})` : "";
  const statusInfo = statusCode ? ` - ${statusCode}` : "";
  logger.info(`${method} ${path}${userInfo}${statusInfo}`);
};

/**
 * API error logger - logs API errors with context
 */
export const logApiError = (
  endpoint: string,
  error: unknown,
  context?: { userId?: string; method?: string; statusCode?: number },
): void => {
  logger.error(`API Error: ${endpoint}`, error, context);
};

/**
 * Auth logger - logs authentication events
 */
export const logAuthEvent = (
  event: "login" | "logout" | "signup" | "token_refresh" | "failed_login",
  userId?: string,
  details?: unknown,
): void => {
  const userInfo = userId ? ` (User: ${userId})` : "";
  logger.info(`Auth Event: ${event}${userInfo}`, details);
};

/**
 * Performance logger - logs performance metrics
 */
export const logPerformance = (
  operation: string,
  durationMs: number,
  details?: unknown,
): void => {
  const message = `Performance: ${operation} took ${durationMs}ms`;
  logger.debug(message, details);
};

export default logger;
