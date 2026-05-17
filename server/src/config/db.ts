import mongoose from 'mongoose';
import { env, requireEnv } from './env';

export async function connectDatabase(): Promise<void> {
  const uri = env.isProduction ? requireEnv('MONGODB_URI') : env.mongodbUri;

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5_000,
  });
  console.log(`MongoDB connected (${mongoose.connection.name})`);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
}
