import type { ProjectConfig } from '../types';
export declare class ProjectService {
    create(userId: string, config: ProjectConfig): Promise<any>;
    list(userId: string): Promise<any>;
    getById(id: string): Promise<any>;
    generateCode(projectId: string, userId: string): Promise<import("../types").GeneratedProject>;
    downloadProject(projectId: string): Promise<string>;
    private saveGeneratedFiles;
}
//# sourceMappingURL=project-service.d.ts.map