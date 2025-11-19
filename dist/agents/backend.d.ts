import type { OrchestratorContext, GeneratedFile } from '../types';
export declare class BackendAgent {
    generate(context: OrchestratorContext): Promise<{
        files: GeneratedFile[];
    }>;
    private generateExpressServer;
    private generateApiRoutes;
    private generateMiddleware;
    private generateControllers;
    private generateServices;
}
//# sourceMappingURL=backend.d.ts.map