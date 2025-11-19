import type { AgentType } from '../types';
interface ContextManagerOptions {
    maxContextSize: number;
    enableMemory: boolean;
    enableRAG: boolean;
    compressionThreshold?: number;
}
/**
 * Advanced Context Manager with Memory and RAG
 *
 * Features:
 * - Large context window (100K+ tokens)
 * - Intelligent context pruning based on relevance
 * - Long-term memory storage for important information
 * - RAG (Retrieval-Augmented Generation) for context retrieval
 * - Context compression for older entries
 * - Priority-based context management
 */
export declare class ContextManager {
    private projectId;
    private options;
    private contextStore;
    private memoryStore;
    private currentTokenCount;
    constructor(projectId: string, options?: Partial<ContextManagerOptions>);
    /**
     * Add data to context with automatic management
     */
    addToContext(key: string, data: unknown, options?: {
        agentType?: AgentType;
        importance?: number;
    }): Promise<void>;
    /**
     * Get context relevant to a specific agent
     */
    getContextForAgent(agentType: AgentType): Promise<Record<string, unknown>>;
    /**
     * Get all current context
     */
    getAllContext(): Record<string, unknown>;
    /**
     * Intelligent context pruning
     * Removes less important and older entries
     */
    private pruneContext;
    /**
     * Calculate relevance score for pruning
     * Higher score = more important to keep
     */
    private calculateRelevanceScore;
    /**
     * Archive important information to long-term memory
     */
    private archiveToMemory;
    /**
     * Retrieve relevant information from memory (RAG)
     */
    private retrieveFromMemory;
    /**
     * Search context by key pattern
     */
    searchContext(pattern: string | RegExp): Record<string, unknown>;
    /**
     * Get context statistics
     */
    getStats(): {
        activeEntries: number;
        memoryEntries: number;
        totalTokens: number;
        maxTokens: number;
        utilizationPercent: number;
    };
    /**
     * Clear all context (use with caution!)
     */
    clearContext(): void;
    /**
     * Clear memory (use with caution!)
     */
    clearMemory(): void;
    /**
     * Export context for persistence
     */
    exportContext(): string;
    /**
     * Import context from persistence
     */
    importContext(data: string): void;
}
export {};
//# sourceMappingURL=context-manager.d.ts.map