import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config, validateConfig } from '@/config';
import { logger } from '@/utils/logger';
import apiRouter from '@/api/routes';
import { errorHandler } from '@/api/middleware/error-handler';
import { swaggerSpec } from '@/api/swagger';
import { rateLimiter } from '@/api/middleware/rate-limiter';

// Validate configuration on startup
validateConfig();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.app.env === 'production' ? config.app.url : '*',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: config.app.version,
  });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Ultimate App Builder API Docs',
}));

// API routes
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not found',
  });
});

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const PORT = config.app.port;

app.listen(PORT, () => {
  logger.info(`🚀 ${config.app.name} v${config.app.version} started on port ${PORT}`);
  logger.info(`Environment: ${config.app.env}`);
  logger.info(`Health check: ${config.app.url}/health`);
});

export default app;
