import type { AuthResponse, UserPublic } from '../types/user';
import { apiRequest } from './client';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  });

  return response.data;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
    auth: false,
  });

  return response.data;
}

export async function fetchCurrentUser(): Promise<UserPublic> {
  const response = await apiRequest<UserPublic>('/auth/me');
  return response.data;
}
