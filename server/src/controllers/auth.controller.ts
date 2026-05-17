import type { Request, Response } from 'express';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';
import * as authService from '../services/auth.service';
import type { ApiSuccessResponse } from '../types/api';
import type { AuthResponse, UserPublic } from '../types/user';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as RegisterInput;
  const data = await authService.register(body);

  const response: ApiSuccessResponse<AuthResponse> = {
    success: true,
    data,
    message: 'Registration successful',
  };

  res.status(201).json(response);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as LoginInput;
  const data = await authService.login(body);

  const response: ApiSuccessResponse<AuthResponse> = {
    success: true,
    data,
    message: 'Login successful',
  };

  res.status(200).json(response);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }

  const data = await authService.getMe(req.user.id);

  const response: ApiSuccessResponse<UserPublic> = {
    success: true,
    data,
  };

  res.status(200).json(response);
});
