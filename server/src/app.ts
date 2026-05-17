import cors from 'cors';
import express, { type Application } from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import apiRoutes from './routes/index';

export function createApp(): Application {
  const app = express();

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || origin.endsWith(".vercel.app")) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true
  }))
  app.use(express.json());

  app.use('/api', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
