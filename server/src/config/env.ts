import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  port: Number(optionalEnv('PORT', '4000')),
  clientUrl: optionalEnv('CLIENT_URL', 'http://localhost:5173'),
  mongodbUri: optionalEnv('MONGODB_URI', 'mongodb://localhost:27017/smartleads'),
  jwtSecret: optionalEnv('JWT_SECRET', 'dev-only-change-in-production'),
  jwtExpiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
  isProduction: optionalEnv('NODE_ENV', 'development') === 'production',
} as const;

/** Call when a variable must exist (e.g. before production start). */
export { requireEnv };
