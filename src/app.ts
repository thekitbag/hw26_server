import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '@/config/env';
import { logger } from '@/middlewares/logger';
import { errorHandler } from '@/middlewares/errorHandler';
import healthRouter from '@/routes/health';
import feedbackRouter from '@/routes/feedback';

const app: Application = express();

// Logging middleware (must be first)
app.use(logger);

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(healthRouter);
app.use(feedbackRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
