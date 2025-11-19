import type { OrchestratorContext, GeneratedFile } from '../types';
export declare class AuthAgent {
    generate(context: OrchestratorContext): Promise<{
        files: GeneratedFile[];
    }>;
    private generateAuthRoutes;
    private generateAuthController;
    private generateAuthService;
    private generateAuthMiddleware;
    private generateJwtUtils;
}
//# sourceMappingURL=auth.d.ts.map