export const USER_ROLES = ['admin', 'sales'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: UserPublic;
  token: string;
}
