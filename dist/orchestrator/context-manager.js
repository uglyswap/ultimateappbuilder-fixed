"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextManager = void 0;
const logger_1 = require("../utils/logger");
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
class ContextManager {
    projectId;
    options;
    contextStore = new Map();
    memoryStore = new Map();
    currentTokenCount = 0;
    constructor(projectId, options = {}) {
        this.projectId = projectId;
        this.options = {
            maxContextSize: options.maxContextSize || 100000,
            enableMemory: options.enableMemory ?? true,
            enableRAG: options.enableRAG ?? true,
            compressionThreshold: options.compressionThreshold || 80000,
        };
        logger_1.logger.info('📚 Context Manager initialized', {
            projectId,
            maxSize: this.options.maxContextSize,
            memory: this.options.enableMemory,
            rag: this.options.enableRAG,
        });
    }
    /**
     * Add data to context with automatic management
     */
    async addToContext(key, data, options = {}) {
        const id = `${key}_${Date.now()}`;
        // Estimate token count (rough: 4 chars = 1 token)
        const dataStr = JSON.stringify(data);
        const tokens = Math.ceil(dataStr.length / 4);
        const entry = {
            id,
            key,
            data,
            timestamp: Date.now(),
            agentType: options.agentType,
            tokens,
            importance: options.importance || 5,
        };
        // Add to context store
        this.contextStore.set(id, entry);
        this.currentTokenCount += tokens;
        logger_1.logger.debug('Added to context', {
            key,
            tokens,
            totalTokens: this.currentTokenCount,
        });
        // Check if we need to prune
        if (this.currentTokenCount > this.options.maxContextSize) {
            await this.pruneContext();
        }
        // Archive important info to memory
        if (this.options.enableMemory && entry.importance >= 8) {
            await this.archiveToMemory(entry);
        }
    }
    /**
     * Get context relevant to a specific agent
     */
    async getContextForAgent(agentType) {
        const relevantContext = {};
        // Get from active context
        for (const [, entry] of this.contextStore) {
            // Include if:
            // 1. It's from the same agent type
            // 2. It's high importance (>= 7)
            // 3. It's recent (< 5 minutes)
            const isRelevant = entry.agentType === agentType ||
                entry.importance >= 7 ||
                Date.now() - entry.timestamp < 5 * 60 * 1000;
            if (isRelevant) {
                relevantContext[entry.key] = entry.data;
            }
        }
        // RAG: Retrieve from memory if enabled
        if (this.options.enableRAG) {
            const memoryContext = await this.retrieveFromMemory(agentType);
            Object.assign(relevantContext, memoryContext);
        }
        logger_1.logger.debug('Retrieved context for agent', {
            agentType,
            entriesCount: Object.keys(relevantContext).length,
        });
        return relevantContext;
    }
    /**
     * Get all current context
     */
    getAllContext() {
        const allContext = {};
        for (const [, entry] of this.contextStore) {
            allContext[entry.key] = entry.data;
        }
        return allContext;
    }
    /**
     * Intelligent context pruning
     * Removes less important and older entries
     */
    async pruneContext() {
        logger_1.logger.info('🧹 Pruning context', {
            currentTokens: this.currentTokenCount,
            maxTokens: this.options.maxContextSize,
        });
        // Sort entries by score (importance + recency)
        const entries = Array.from(this.contextStore.values());
        const scored = entries.map(entry => ({
            entry,
            score: this.calculateRelevanceScore(entry),
        }));
        scored.sort((a, b) => a.score - b.score); // Lower score = less important
        // Remove lowest scored entries until we're under threshold
        const targetSize = this.options.maxContextSize * 0.7; // Target 70% of max
        let removed = 0;
        while (this.currentTokenCount > targetSize && scored.length > 0) {
            const { entry } = scored.shift();
            // Archive to memory if important
            if (this.options.enableMemory && entry.importance >= 6) {
                await this.archiveToMemory(entry);
            }
            // Remove from context
            this.contextStore.delete(entry.id);
            this.currentTokenCount -= entry.tokens || 0;
            removed++;
        }
        logger_1.logger.info('✅ Context pruned', {
            removed,
            remaining: this.contextStore.size,
            tokens: this.currentTokenCount,
        });
    }
    /**
     * Calculate relevance score for pruning
     * Higher score = more important to keep
     */
    calculateRelevanceScore(entry) {
        const ageMinutes = (Date.now() - entry.timestamp) / (1000 * 60);
        // Score factors:
        // - Importance: 0-10 (weight: 10)
        // - Recency: Decays over time (weight: 5)
        const importanceScore = entry.importance * 10;
        const recencyScore = Math.max(0, 50 - ageMinutes); // Decays to 0 after 50 minutes
        return importanceScore + recencyScore;
    }
    /**
     * Archive important information to long-term memory
     */
    async archiveToMemory(entry) {
        if (!this.options.enableMemory)
            return;
        this.memoryStore.set(entry.id, {
            ...entry,
            timestamp: Date.now(), // Update timestamp for memory
        });
        logger_1.logger.debug('Archived to memory', {
            key: entry.key,
            importance: entry.importance,
        });
    }
    /**
     * Retrieve relevant information from memory (RAG)
     */
    async retrieveFromMemory(agentType) {
        if (!this.options.enableRAG)
            return {};
        const relevant = {};
        // Search memory for entries related to this agent
        for (const [, entry] of this.memoryStore) {
            if (entry.agentType === agentType || entry.importance >= 9) {
                relevant[entry.key] = entry.data;
            }
        }
        logger_1.logger.debug('Retrieved from memory', {
            agentType,
            count: Object.keys(relevant).length,
        });
        return relevant;
    }
    /**
     * Search context by key pattern
     */
    searchContext(pattern) {
        const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
        const results = {};
        for (const [, entry] of this.contextStore) {
            if (regex.test(entry.key)) {
                results[entry.key] = entry.data;
            }
        }
        // Also search memory if RAG enabled
        if (this.options.enableRAG) {
            for (const [, entry] of this.memoryStore) {
                if (regex.test(entry.key)) {
                    results[entry.key] = entry.data;
                }
            }
        }
        return results;
    }
    /**
     * Get context statistics
     */
    getStats() {
        return {
            activeEntries: this.contextStore.size,
            memoryEntries: this.memoryStore.size,
            totalTokens: this.currentTokenCount,
            maxTokens: this.options.maxContextSize,
            utilizationPercent: (this.currentTokenCount / this.options.maxContextSize) * 100,
        };
    }
    /**
     * Clear all context (use with caution!)
     */
    clearContext() {
        this.contextStore.clear();
        this.currentTokenCount = 0;
        logger_1.logger.warn('Context cleared', { projectId: this.projectId });
    }
    /**
     * Clear memory (use with caution!)
     */
    clearMemory() {
        this.memoryStore.clear();
        logger_1.logger.warn('Memory cleared', { projectId: this.projectId });
    }
    /**
     * Export context for persistence
     */
    exportContext() {
        return JSON.stringify({
            projectId: this.projectId,
            context: Array.from(this.contextStore.entries()),
            memory: Array.from(this.memoryStore.entries()),
            stats: this.getStats(),
        });
    }
    /**
     * Import context from persistence
     */
    importContext(data) {
        try {
            const parsed = JSON.parse(data);
            this.contextStore = new Map(parsed.context);
            this.memoryStore = new Map(parsed.memory);
            // Recalculate token count
            this.currentTokenCount = 0;
            for (const [, entry] of this.contextStore) {
                this.currentTokenCount += entry.tokens || 0;
            }
            logger_1.logger.info('Context imported', this.getStats());
        }
        catch (error) {
            logger_1.logger.error('Failed to import context', { error });
            throw error;
        }
    }
}
exports.ContextManager = ContextManager;
//# sourceMappingURL=context-manager.js.map