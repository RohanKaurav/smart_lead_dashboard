import bcrypt from 'bcryptjs';
import { User, type IUserDocument } from '../models/User';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';
import type { AuthResponse, UserPublic } from '../types/user';
import { AppError } from '../utils/AppError';
import { signToken } from '../utils/jwt';
import { toUserPublic } from '../utils/userMapper';

const SALT_ROUNDS = 12;

function buildAuthResponse(user: IUserDocument): AuthResponse {
  const publicUser = toUserPublic(user);
  const token = signToken({
    sub: publicUser.id,
    email: publicUser.email,
    role: publicUser.role,
  });

  return { user: publicUser, token };
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new AppError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: passwordHash,
    role: 'sales',
  });

  return buildAuthResponse(user);
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const user = await User.findOne({ email: input.email }).select('+password');

  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  return buildAuthResponse(user);
}

export async function getMe(userId: string): Promise<UserPublic> {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return toUserPublic(user);
}
