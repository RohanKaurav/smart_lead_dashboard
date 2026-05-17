import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/db';
import { env, requireEnv } from './config/env';

async function bootstrap(): Promise<void> {
  if (env.isProduction) {
    requireEnv('MONGODB_URI');
    requireEnv('JWT_SECRET');
  }

  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
    console.log(`Health check: http://localhost:${env.port}/api/health`);
    console.log(`Auth: POST /api/auth/register | POST /api/auth/login | GET /api/auth/me`);
    console.log(`Admin: GET /api/admin/overview (admin role only)`);
    console.log(`Leads: GET|POST /api/leads | GET /api/leads/export | GET|PATCH|DELETE /api/leads/:id`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
