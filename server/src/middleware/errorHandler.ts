import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { env } from '../config/env';
import type { ApiErrorResponse } from '../types/api';
import { AppError } from '../utils/AppError';

function formatZodErrors(error: ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));
}

function formatMongooseValidationErrors(
  error: mongoose.Error.ValidationError,
): Array<{ field: string; message: string }> {
  return Object.values(error.errors).map((err) => ({
    field: err.path,
    message: err.message,
  }));
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: Array<{ field: string; message: string }> | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = formatZodErrors(err);
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = formatMongooseValidationErrors(err);
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: number }).code === 11000
  ) {
    statusCode = 409;
    const duplicateKey = err as { keyPattern?: Record<string, unknown> };
    message =
      duplicateKey.keyPattern && 'email' in duplicateKey.keyPattern
        ? 'Email already registered'
        : 'Duplicate key conflict';
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (statusCode === 500 && !env.isProduction) {
    console.error(err);
  } else if (statusCode === 500) {
    console.error('Unhandled error:', err instanceof Error ? err.message : err);
  }

  const body: ApiErrorResponse = {
    success: false,
    message,
    ...(errors && errors.length > 0 ? { errors } : {}),
  };

  res.status(statusCode).json(body);
}
