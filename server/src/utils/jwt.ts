import jwt, { type SignOptions } from 'jsonwebtoken';
import { env, requireEnv } from '../config/env';
import type { UserRole } from '../types/user';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

function getJwtSecret(): string {
  return env.isProduction ? requireEnv('JWT_SECRET') : env.jwtSecret;
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, getJwtSecret(), options);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded === 'string' || !decoded.sub || !decoded.email || !decoded.role) {
    throw new Error('Invalid token payload');
  }

  return {
    sub: String(decoded.sub),
    email: String(decoded.email),
    role: decoded.role as UserRole,
  };
}
