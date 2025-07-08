import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

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
  return jwt.sign({ userId, email, type: 'access' }, process.env.JWT_SECRET!, {
    expiresIn: '15m',
  });
};

// Generate refresh token (7 days)
export const generateRefreshToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
};

// Generate both tokens
export const generateTokenPair = (userId: string, email: string): TokenPair => {
  return {
    accessToken: generateAccessToken(userId, email),
    refreshToken: generateRefreshToken(userId, email),
  };
};

// Verify access token
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error(error as string);
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as JwtPayload;
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error(error as string);
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
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

// Legacy function for backward compatibility
export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
