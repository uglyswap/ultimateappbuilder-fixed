"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const routes_1 = __importDefault(require("./api/routes"));
const error_handler_1 = require("./api/middleware/error-handler");
const swagger_1 = require("./api/swagger");
const rate_limiter_1 = require("./api/middleware/rate-limiter");
const websocket_service_1 = require("./services/websocket-service");
const job_queue_service_1 = require("./services/job-queue-service");
// Validate configuration on startup
(0, config_1.validateConfig)();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: config_1.config.app.env === 'production' ? config_1.config.app.url : '*',
    credentials: true,
}));
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Rate limiting
app.use(rate_limiter_1.rateLimiter);
// Request logging
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.path}`, {
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
        version: config_1.config.app.version,
    });
});
// Swagger documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Ultimate App Builder API Docs',
}));
// API routes
app.use('/api', routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Not found',
    });
});
// Error handling
app.use(error_handler_1.errorHandler);
// Initialize services
async function initializeServices() {
    try {
        logger_1.logger.info('🔧 Initializing services...');
        // Initialize WebSocket server
        websocket_service_1.websocketService.initialize(server);
        logger_1.logger.info('✅ WebSocket server initialized');
        // Start job queue workers
        await job_queue_service_1.jobQueueService.startWorkers();
        logger_1.logger.info('✅ Job queue workers started');
        logger_1.logger.info('🎉 All services initialized successfully!');
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to initialize services', { error });
        process.exit(1);
    }
}
// Graceful shutdown
async function gracefulShutdown(signal) {
    logger_1.logger.info(`${signal} received, shutting down gracefully...`);
    try {
        // Close WebSocket connections
        websocket_service_1.websocketService.shutdown();
        logger_1.logger.info('✅ WebSocket server closed');
        // Stop job queue workers
        await job_queue_service_1.jobQueueService.shutdown();
        logger_1.logger.info('✅ Job queue workers stopped');
        // Close HTTP server
        server.close(() => {
            logger_1.logger.info('✅ HTTP server closed');
            process.exit(0);
        });
        // Force shutdown after 10 seconds
        setTimeout(() => {
            logger_1.logger.warn('⚠️ Forcing shutdown after timeout');
            process.exit(1);
        }, 10000);
    }
    catch (error) {
        logger_1.logger.error('❌ Error during shutdown', { error });
        process.exit(1);
    }
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Start server
const PORT = config_1.config.app.port;
server.listen(PORT, async () => {
    logger_1.logger.info('═══════════════════════════════════════════════════════════════');
    logger_1.logger.info(`🚀 ${config_1.config.app.name} v${config_1.config.app.version}`);
    logger_1.logger.info('═══════════════════════════════════════════════════════════════');
    logger_1.logger.info(`🌐 Server: ${config_1.config.app.url}`);
    logger_1.logger.info(`⚡ Environment: ${config_1.config.app.env}`);
    logger_1.logger.info(`🩺 Health check: ${config_1.config.app.url}/health`);
    logger_1.logger.info(`📚 API Docs: ${config_1.config.app.url}/api-docs`);
    logger_1.logger.info(`🔌 WebSocket: ws://localhost:${PORT}/ws`);
    logger_1.logger.info(`🤖 Autonomous Mode: ${config_1.config.autonomous?.enabled ? 'ENABLED ✅' : 'DISABLED'}`);
    logger_1.logger.info('═══════════════════════════════════════════════════════════════');
    // Initialize services
    await initializeServices();
    logger_1.logger.info('✨ Ready to build amazing apps! ✨');
});
exports.default = app;
//# sourceMappingURL=index.js.map