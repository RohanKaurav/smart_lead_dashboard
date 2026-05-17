import type { NextFunction, Request, Response } from 'express';
import type { AuthUser } from '../types/user';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(401, 'Authentication required'));
    return;
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    next(new AppError(401, 'Authentication required'));
    return;
  }

  try {
    const payload = verifyToken(token);
    const user: AuthUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    req.user = user;
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
}
