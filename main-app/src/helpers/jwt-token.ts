import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

export interface JwtPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Generate access token (15 minutes)
export const generateAccessToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET || '';
  return jwt.sign({ userId, email, type: 'access' }, secret, {
    expiresIn: '15m',
  });
};

// Generate refresh token (7 days)
export const generateRefreshToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET || '';
  return jwt.sign({ userId, email, type: 'refresh' }, secret, {
    expiresIn: '7d',
  });
};

// Generate both tokens
export const generateTokenPair = (userId: string, email: string): TokenPair => {
  return {
    accessToken: generateAccessToken(userId, email),
    refreshToken: generateRefreshToken(userId, email),
  };
};

/**
 * Verify access token
 * @param token - JWT access token
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const secret = process.env.JWT_SECRET || '';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type: expected access token');
    }
    return decoded;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token verification failed';
    throw new Error(`Access token verification failed: ${message}`);
  }
};

/**
 * Verify refresh token
 * @param token - JWT refresh token
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET || '';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type: expected refresh token');
    }
    return decoded;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token verification failed';
    throw new Error(`Refresh token verification failed: ${message}`);
  }
};

// Extract token from Authorization header
export const extractTokenFromHeader = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

// Middleware function for authentication
export const authenticateToken = (request: NextRequest): JwtPayload => {
  const token = extractTokenFromHeader(request);
  if (!token) {
    throw new Error('No token provided');
  }
  return verifyAccessToken(token);
};

// Legacy function for backward compatibility
export const generateJwtToken = (payload: { userId: string }): string => {
  const secret = process.env.JWT_SECRET || '';
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

// Legacy function for backward compatibility
export const verifyJwtToken = (token: string) => {
  const secret = process.env.JWT_SECRET || '';
  return jwt.verify(token, secret);
};
