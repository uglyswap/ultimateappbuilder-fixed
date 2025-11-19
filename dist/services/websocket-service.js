"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websocketService = exports.WebSocketService = void 0;
const ws_1 = require("ws");
const logger_1 = require("../utils/logger");
/**
 * WebSocket Service for Real-Time Updates
 * AUTONOMOUS MODE: No polling, instant updates!
 */
class WebSocketService {
    wss;
    clients = new Map();
    /**
     * Initialize WebSocket server
     */
    initialize(server) {
        this.wss = new ws_1.WebSocketServer({ server, path: '/ws' });
        this.wss.on('connection', (ws, req) => {
            const clientId = this.generateClientId();
            const url = new URL(req.url || '', `http://${req.headers.host}`);
            const userId = url.searchParams.get('userId');
            const projectId = url.searchParams.get('projectId');
            logger_1.logger.info('[WebSocket] Client connected', { clientId, userId, projectId });
            this.clients.set(clientId, { ws, userId: userId || undefined, projectId: projectId || undefined });
            // Send welcome message
            this.sendToClient(clientId, {
                type: 'notification',
                data: {
                    message: '🚀 Connected to Ultimate App Builder - Autonomous Mode Active!',
                    timestamp: new Date().toISOString(),
                },
            });
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    this.handleClientMessage(clientId, data);
                }
                catch (error) {
                    logger_1.logger.error('[WebSocket] Invalid message', { error, message });
                }
            });
            ws.on('close', () => {
                logger_1.logger.info('[WebSocket] Client disconnected', { clientId });
                this.clients.delete(clientId);
            });
            ws.on('error', (error) => {
                logger_1.logger.error('[WebSocket] Client error', { clientId, error });
                this.clients.delete(clientId);
            });
        });
        logger_1.logger.info('[WebSocket] Server initialized and ready for real-time updates! ⚡');
    }
    /**
     * Send generation progress update
     */
    sendGenerationProgress(projectId, progress) {
        this.broadcastToProject(projectId, {
            type: 'generation_progress',
            projectId,
            data: {
                ...progress,
                timestamp: new Date().toISOString(),
            },
        });
    }
    /**
     * Send generation complete notification
     */
    sendGenerationComplete(projectId, data) {
        this.broadcastToProject(projectId, {
            type: 'generation_complete',
            projectId,
            data: {
                ...data,
                timestamp: new Date().toISOString(),
            },
        });
    }
    /**
     * Send generation error
     */
    sendGenerationError(projectId, error) {
        this.broadcastToProject(projectId, {
            type: 'generation_error',
            projectId,
            data: {
                ...error,
                timestamp: new Date().toISOString(),
            },
        });
    }
    /**
     * Send deployment progress
     */
    sendDeploymentProgress(projectId, progress) {
        this.broadcastToProject(projectId, {
            type: 'deployment_progress',
            projectId,
            data: {
                ...progress,
                timestamp: new Date().toISOString(),
            },
        });
    }
    /**
     * Send notification to specific user
     */
    sendNotification(userId, notification) {
        this.broadcastToUser(userId, {
            type: 'notification',
            userId,
            data: {
                ...notification,
                timestamp: new Date().toISOString(),
            },
        });
    }
    /**
     * Broadcast message to all clients watching a project
     */
    broadcastToProject(projectId, message) {
        let sentCount = 0;
        this.clients.forEach((client, clientId) => {
            if (client.projectId === projectId && client.ws.readyState === ws_1.WebSocket.OPEN) {
                this.sendToClient(clientId, message);
                sentCount++;
            }
        });
        logger_1.logger.debug(`[WebSocket] Broadcast to project ${projectId}: ${sentCount} clients`);
    }
    /**
     * Broadcast message to all clients of a user
     */
    broadcastToUser(userId, message) {
        let sentCount = 0;
        this.clients.forEach((client, clientId) => {
            if (client.userId === userId && client.ws.readyState === ws_1.WebSocket.OPEN) {
                this.sendToClient(clientId, message);
                sentCount++;
            }
        });
        logger_1.logger.debug(`[WebSocket] Broadcast to user ${userId}: ${sentCount} clients`);
    }
    /**
     * Send message to specific client
     */
    sendToClient(clientId, message) {
        const client = this.clients.get(clientId);
        if (client && client.ws.readyState === ws_1.WebSocket.OPEN) {
            try {
                client.ws.send(JSON.stringify(message));
            }
            catch (error) {
                logger_1.logger.error('[WebSocket] Failed to send message', { clientId, error });
            }
        }
    }
    /**
     * Handle incoming message from client
     */
    handleClientMessage(clientId, message) {
        logger_1.logger.debug('[WebSocket] Message received', { clientId, message });
        // Update client metadata if needed
        if (message.type === 'subscribe' && message.projectId) {
            const client = this.clients.get(clientId);
            if (client) {
                client.projectId = message.projectId;
                this.sendToClient(clientId, {
                    type: 'notification',
                    data: {
                        message: `Subscribed to project updates: ${message.projectId}`,
                        type: 'success',
                    },
                });
            }
        }
    }
    /**
     * Generate unique client ID
     */
    generateClientId() {
        return `client_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }
    /**
     * Get connected clients count
     */
    getConnectedClientsCount() {
        return this.clients.size;
    }
    /**
     * Close all connections and shutdown
     */
    shutdown() {
        logger_1.logger.info('[WebSocket] Shutting down...');
        this.clients.forEach((client) => {
            if (client.ws.readyState === ws_1.WebSocket.OPEN) {
                client.ws.close();
            }
        });
        this.clients.clear();
        if (this.wss) {
            this.wss.close();
        }
        logger_1.logger.info('[WebSocket] Shutdown complete');
    }
}
exports.WebSocketService = WebSocketService;
exports.websocketService = new WebSocketService();
//# sourceMappingURL=websocket-service.js.map