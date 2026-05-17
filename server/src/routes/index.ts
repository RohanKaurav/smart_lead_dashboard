import { Router } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env';
import type { ApiSuccessResponse } from '../types/api';

interface HealthData {
  status: string;
  timestamp: string;
  environment: string;
  database: string;
}

const router = Router();

router.get('/health', (_req, res) => {
  const payload: ApiSuccessResponse<HealthData> = {
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.nodeEnv,
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    },
  };

  res.status(200).json(payload);
});

export default router;
