import type { IUserDocument } from '../models/User';
import type { UserPublic } from '../types/user';

export function toUserPublic(user: IUserDocument): UserPublic {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
