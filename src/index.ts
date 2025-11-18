import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import { config, validateConfig } from '@/config';
import { logger } from '@/utils/logger';
import apiRouter from '@/api/routes';
import { errorHandler } from '@/api/middleware/error-handler';
import { swaggerSpec } from '@/api/swagger';
import { rateLimiter } from '@/api/middleware/rate-limiter';
import { websocketService } from '@/services/websocket-service';
import { jobQueueService } from '@/services/job-queue-service';

// Validate configuration on startup
validateConfig();

const app = express();
const server = createServer(app);

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

// Initialize services
async function initializeServices() {
  try {
    logger.info('🔧 Initializing services...');

    // Initialize system configuration defaults
    const { systemConfigService } = await import('@/services/system-config-service');
    await systemConfigService.initializeDefaults();
    logger.info('✅ System configuration initialized');

    // Initialize WebSocket server
    websocketService.initialize(server);
    logger.info('✅ WebSocket server initialized');

    // Start job queue workers
    await jobQueueService.startWorkers();
    logger.info('✅ Job queue workers started');

    logger.info('🎉 All services initialized successfully!');
  } catch (error) {
    logger.error('❌ Failed to initialize services', { error });
    process.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  logger.info(`${signal} received, shutting down gracefully...`);

  try {
    // Close WebSocket connections
    websocketService.shutdown();
    logger.info('✅ WebSocket server closed');

    // Stop job queue workers
    await jobQueueService.shutdown();
    logger.info('✅ Job queue workers stopped');

    // Close HTTP server
    server.close(() => {
      logger.info('✅ HTTP server closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.warn('⚠️ Forcing shutdown after timeout');
      process.exit(1);
    }, 10000);
  } catch (error) {
    logger.error('❌ Error during shutdown', { error });
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const PORT = config.app.port;

server.listen(PORT, async () => {
  logger.info('═══════════════════════════════════════════════════════════════');
  logger.info(`🚀 ${config.app.name} v${config.app.version}`);
  logger.info('═══════════════════════════════════════════════════════════════');
  logger.info(`🌐 Server: ${config.app.url}`);
  logger.info(`⚡ Environment: ${config.app.env}`);
  logger.info(`🩺 Health check: ${config.app.url}/health`);
  logger.info(`📚 API Docs: ${config.app.url}/api-docs`);
  logger.info(`🔌 WebSocket: ws://localhost:${PORT}/ws`);
  logger.info(`🤖 Autonomous Mode: ${config.autonomous?.enabled ? 'ENABLED ✅' : 'DISABLED'}`);
  logger.info('═══════════════════════════════════════════════════════════════');

  // Initialize services
  await initializeServices();

  logger.info('✨ Ready to build amazing apps! ✨');
});

export default app;
