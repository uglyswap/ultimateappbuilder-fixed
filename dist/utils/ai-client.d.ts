import type { AgentType } from '../types';
export declare class AIClient {
    private client;
    constructor();
    generateCode(prompt: string, agentType: AgentType, systemPrompt?: string): Promise<{
        content: string;
        tokensUsed: number;
    }>;
    streamGeneration(prompt: string, agentType: AgentType, onChunk: (chunk: string) => void): Promise<{
        content: string;
        tokensUsed: number;
    }>;
    private getSystemPrompt;
}
export declare const aiClient: AIClient;
//# sourceMappingURL=ai-client.d.ts.map