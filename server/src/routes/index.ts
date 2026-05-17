import { Router } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env';
import type { ApiSuccessResponse } from '../types/api';
import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';

interface HealthData {
  status: string;
  timestamp: string;
  environment: string;
  database: string;
}

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/leads', leadRoutes);

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
