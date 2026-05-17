import type { ApiErrorResponse, ApiSuccessResponse } from '../types/api';
import { clearToken, getToken } from '../utils/token';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://smart-lead-dashboard-1-tqur.onrender.com';

export class ApiRequestError extends Error {
  readonly statusCode: number;
  readonly errors?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiSuccessResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const useAuth = options.auth !== false;
  if (useAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  let payload: ApiSuccessResponse<T> | ApiErrorResponse;

  try {
    payload = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;
  } catch {
    throw new ApiRequestError('Invalid server response', response.status);
  }

  if (!payload.success) {
    if (response.status === 401 && useAuth) {
      clearToken();
    }

    throw new ApiRequestError(payload.message, response.status, payload.errors);
  }

  return payload;
}
