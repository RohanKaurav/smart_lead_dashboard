import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../config/db';
import { User } from '../models/User';

dotenv.config();

const SALT_ROUNDS = 12;

function requireSeedEnv(key: string): string {
  const value = process.env[key];
  if (!value?.trim()) {
    throw new Error(`Missing required seed variable: ${key}`);
  }
  return value.trim();
}

async function seedAdmin(): Promise<void> {
  const name = requireSeedEnv('ADMIN_NAME');
  const email = requireSeedEnv('ADMIN_EMAIL').toLowerCase();
  const password = requireSeedEnv('ADMIN_PASSWORD');

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  }

  await connectDatabase();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.role === 'admin') {
      console.log(`Admin already exists: ${email}`);
      return;
    }

    existingUser.role = 'admin';
    existingUser.name = name;
    existingUser.password = await bcrypt.hash(password, SALT_ROUNDS);
    await existingUser.save();

    console.log(`Promoted existing user to admin: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await User.create({
    name,
    email,
    password: passwordHash,
    role: 'admin',
  });

  console.log(`Admin user created: ${email}`);
}

seedAdmin()
  .catch((error: unknown) => {
    console.error('Admin seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
