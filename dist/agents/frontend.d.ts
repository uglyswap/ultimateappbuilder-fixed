import type { OrchestratorContext, GeneratedFile } from '../types';
export declare class FrontendAgent {
    generate(context: OrchestratorContext): Promise<{
        files: GeneratedFile[];
    }>;
    private generateViteConfig;
    private generateMain;
    private generateApp;
    private generateComponents;
    private generateHooks;
    private generateUtils;
    private generateTailwindConfig;
}
//# sourceMappingURL=frontend.d.ts.map