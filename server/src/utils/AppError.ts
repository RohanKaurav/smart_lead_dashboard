export class AppError extends Error {
  readonly statusCode: number;
  readonly errors?: Array<{ field: string; message: string }>;
  readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
