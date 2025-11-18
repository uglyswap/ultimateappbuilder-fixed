import { Server as HTTPServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '@/utils/logger';

interface WSMessage {
  type: 'generation_progress' | 'generation_complete' | 'generation_error' | 'deployment_progress' | 'notification';
  projectId?: string;
  userId?: string;
  data: any;
}

interface ConnectedClient {
  ws: WebSocket;
  userId?: string;
  projectId?: string;
}

/**
 * WebSocket Service for Real-Time Updates
 * AUTONOMOUS MODE: No polling, instant updates!
 */
export class WebSocketService {
  private wss?: WebSocketServer;
  private clients: Map<string, ConnectedClient> = new Map();

  /**
   * Initialize WebSocket server
   */
  initialize(server: HTTPServer) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket, req) => {
      const clientId = this.generateClientId();
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId');
      const projectId = url.searchParams.get('projectId');

      logger.info('[WebSocket] Client connected', { clientId, userId, projectId });

      this.clients.set(clientId, { ws, userId: userId || undefined, projectId: projectId || undefined });

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'notification',
        data: {
          message: '🚀 Connected to Ultimate App Builder - Autonomous Mode Active!',
          timestamp: new Date().toISOString(),
        },
      });

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleClientMessage(clientId, data);
        } catch (error) {
          logger.error('[WebSocket] Invalid message', { error, message });
        }
      });

      ws.on('close', () => {
        logger.info('[WebSocket] Client disconnected', { clientId });
        this.clients.delete(clientId);
      });

      ws.on('error', (error) => {
        logger.error('[WebSocket] Client error', { clientId, error });
        this.clients.delete(clientId);
      });
    });

    logger.info('[WebSocket] Server initialized and ready for real-time updates! ⚡');
  }

  /**
   * Send generation progress update
   */
  sendGenerationProgress(projectId: string, progress: {
    step: string;
    percentage: number;
    currentAgent?: string;
    message?: string;
  }) {
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
  sendGenerationComplete(projectId: string, data: {
    success: boolean;
    filesGenerated: number;
    downloadUrl?: string;
  }) {
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
  sendGenerationError(projectId: string, error: {
    message: string;
    step?: string;
    agentType?: string;
  }) {
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
  sendDeploymentProgress(projectId: string, progress: {
    step: string;
    percentage: number;
    logs?: string[];
  }) {
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
  sendNotification(userId: string, notification: {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
  }) {
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
  private broadcastToProject(projectId: string, message: WSMessage) {
    let sentCount = 0;

    this.clients.forEach((client, clientId) => {
      if (client.projectId === projectId && client.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(clientId, message);
        sentCount++;
      }
    });

    logger.debug(`[WebSocket] Broadcast to project ${projectId}: ${sentCount} clients`);
  }

  /**
   * Broadcast message to all clients of a user
   */
  private broadcastToUser(userId: string, message: WSMessage) {
    let sentCount = 0;

    this.clients.forEach((client, clientId) => {
      if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(clientId, message);
        sentCount++;
      }
    });

    logger.debug(`[WebSocket] Broadcast to user ${userId}: ${sentCount} clients`);
  }

  /**
   * Send message to specific client
   */
  private sendToClient(clientId: string, message: WSMessage) {
    const client = this.clients.get(clientId);

    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        logger.error('[WebSocket] Failed to send message', { clientId, error });
      }
    }
  }

  /**
   * Handle incoming message from client
   */
  private handleClientMessage(clientId: string, message: any) {
    logger.debug('[WebSocket] Message received', { clientId, message });

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
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Get connected clients count
   */
  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  /**
   * Close all connections and shutdown
   */
  shutdown() {
    logger.info('[WebSocket] Shutting down...');

    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.close();
      }
    });

    this.clients.clear();

    if (this.wss) {
      this.wss.close();
    }

    logger.info('[WebSocket] Shutdown complete');
  }
}

export const websocketService = new WebSocketService();
