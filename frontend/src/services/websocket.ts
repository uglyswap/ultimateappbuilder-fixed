import type {
  WebSocketMessage,
  WebSocketMessageType,
  GenerationProgressPayload,
  AgentStatusUpdatePayload,
  FileGeneratedPayload,
  GenerationLog,
} from '../types';

type MessageHandler = (payload: unknown) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;
  private handlers: Map<WebSocketMessageType, Set<MessageHandler>> = new Map();
  private url: string;
  private isIntentionallyClosed = false;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = import.meta.env.VITE_WS_URL || `${wsProtocol}//${window.location.host}`;
    this.url = `${wsHost}/ws`;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isIntentionallyClosed = false;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;

        // Send authentication token
        const token = localStorage.getItem('auth_token');
        if (token) {
          this.send('auth', { token });
        }

        // Start ping interval to keep connection alive
        this.startPingInterval();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.stopPingInterval();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.handlers.clear();
    this.reconnectAttempts = 0;
  }

  private startPingInterval(): void {
    this.stopPingInterval();
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (this.isIntentionallyClosed) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);

    console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.handlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(message.payload);
        } catch (error) {
          console.error(`Error in message handler for ${message.type}:`, error);
        }
      });
    }
  }

  send(type: string, payload: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', { type, payload });
    }
  }

  subscribe(type: WebSocketMessageType, handler: MessageHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(type);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(type);
        }
      }
    };
  }

  // Convenience methods for specific message types
  onGenerationStarted(handler: (payload: { projectId: string; generationId: string }) => void) {
    return this.subscribe('generation_started' as WebSocketMessageType, handler as MessageHandler);
  }

  onGenerationProgress(handler: (payload: GenerationProgressPayload) => void) {
    return this.subscribe('generation_progress' as WebSocketMessageType, handler as MessageHandler);
  }

  onGenerationCompleted(handler: (payload: { projectId: string; generationId: string }) => void) {
    return this.subscribe('generation_completed' as WebSocketMessageType, handler as MessageHandler);
  }

  onGenerationFailed(handler: (payload: { projectId: string; generationId: string; error: string }) => void) {
    return this.subscribe('generation_failed' as WebSocketMessageType, handler as MessageHandler);
  }

  onAgentStatusUpdate(handler: (payload: AgentStatusUpdatePayload) => void) {
    return this.subscribe('agent_status_update' as WebSocketMessageType, handler as MessageHandler);
  }

  onLogMessage(handler: (payload: GenerationLog) => void) {
    return this.subscribe('log_message' as WebSocketMessageType, handler as MessageHandler);
  }

  onFileGenerated(handler: (payload: FileGeneratedPayload) => void) {
    return this.subscribe('file_generated' as WebSocketMessageType, handler as MessageHandler);
  }

  // Subscribe to all events for a specific project
  subscribeToProject(projectId: string, handlers: {
    onProgress?: (payload: GenerationProgressPayload) => void;
    onAgentUpdate?: (payload: AgentStatusUpdatePayload) => void;
    onFileGenerated?: (payload: FileGeneratedPayload) => void;
    onCompleted?: () => void;
    onFailed?: (error: string) => void;
  }): () => void {
    const unsubscribeFns: Array<() => void> = [];

    if (handlers.onProgress) {
      unsubscribeFns.push(
        this.onGenerationProgress((payload) => {
          if (payload.projectId === projectId) {
            handlers.onProgress!(payload);
          }
        })
      );
    }

    if (handlers.onAgentUpdate) {
      unsubscribeFns.push(
        this.onAgentStatusUpdate((payload) => {
          if (payload.projectId === projectId) {
            handlers.onAgentUpdate!(payload);
          }
        })
      );
    }

    if (handlers.onFileGenerated) {
      unsubscribeFns.push(
        this.onFileGenerated((payload) => {
          if (payload.projectId === projectId) {
            handlers.onFileGenerated!(payload);
          }
        })
      );
    }

    if (handlers.onCompleted) {
      unsubscribeFns.push(
        this.onGenerationCompleted((payload) => {
          if (payload.projectId === projectId) {
            handlers.onCompleted!();
          }
        })
      );
    }

    if (handlers.onFailed) {
      unsubscribeFns.push(
        this.onGenerationFailed((payload) => {
          if (payload.projectId === projectId) {
            handlers.onFailed!(payload.error);
          }
        })
      );
    }

    // Return function to unsubscribe from all
    return () => {
      unsubscribeFns.forEach((unsubscribe) => unsubscribe());
    };
  }
}

// Export singleton instance
export const websocket = new WebSocketService();

// Auto-connect on import (can be disabled if needed)
if (typeof window !== 'undefined') {
  websocket.connect();
}
