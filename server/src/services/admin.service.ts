import { User } from '../models/User';
import type { UserPublic, UserRole } from '../types/user';
import { toUserPublic } from '../utils/userMapper';

export interface RoleSummary {
  admin: number;
  sales: number;
  total: number;
}

export interface AdminOverview {
  usersByRole: RoleSummary;
  users: UserPublic[];
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const users = await User.find().sort({ createdAt: -1 });

  const usersByRole: RoleSummary = {
    admin: 0,
    sales: 0,
    total: users.length,
  };

  for (const user of users) {
    usersByRole[user.role as UserRole] += 1;
  }

  return {
    usersByRole,
    users: users.map((user) => toUserPublic(user)),
  };
}
