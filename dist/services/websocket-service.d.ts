import { Server as HTTPServer } from 'http';
/**
 * WebSocket Service for Real-Time Updates
 * AUTONOMOUS MODE: No polling, instant updates!
 */
export declare class WebSocketService {
    private wss?;
    private clients;
    /**
     * Initialize WebSocket server
     */
    initialize(server: HTTPServer): void;
    /**
     * Send generation progress update
     */
    sendGenerationProgress(projectId: string, progress: {
        step: string;
        percentage: number;
        currentAgent?: string;
        message?: string;
    }): void;
    /**
     * Send generation complete notification
     */
    sendGenerationComplete(projectId: string, data: {
        success: boolean;
        filesGenerated: number;
        downloadUrl?: string;
    }): void;
    /**
     * Send generation error
     */
    sendGenerationError(projectId: string, error: {
        message: string;
        step?: string;
        agentType?: string;
    }): void;
    /**
     * Send deployment progress
     */
    sendDeploymentProgress(projectId: string, progress: {
        step: string;
        percentage: number;
        logs?: string[];
    }): void;
    /**
     * Send notification to specific user
     */
    sendNotification(userId: string, notification: {
        title: string;
        message: string;
        type?: 'success' | 'error' | 'info' | 'warning';
    }): void;
    /**
     * Broadcast message to all clients watching a project
     */
    private broadcastToProject;
    /**
     * Broadcast message to all clients of a user
     */
    private broadcastToUser;
    /**
     * Send message to specific client
     */
    private sendToClient;
    /**
     * Handle incoming message from client
     */
    private handleClientMessage;
    /**
     * Generate unique client ID
     */
    private generateClientId;
    /**
     * Get connected clients count
     */
    getConnectedClientsCount(): number;
    /**
     * Close all connections and shutdown
     */
    shutdown(): void;
}
export declare const websocketService: WebSocketService;
//# sourceMappingURL=websocket-service.d.ts.map