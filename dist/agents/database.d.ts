import type { OrchestratorContext, GeneratedFile } from '../types';
export declare class DatabaseAgent {
    generate(context: OrchestratorContext): Promise<{
        files: GeneratedFile[];
    }>;
    private generatePrismaSchema;
    private generatePrismaClient;
    private generateSeedFile;
}
//# sourceMappingURL=database.d.ts.map