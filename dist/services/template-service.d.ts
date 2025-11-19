import type { TemplateConfig } from '../types';
export declare class TemplateService {
    list(): Promise<any>;
    getById(id: string): Promise<any>;
    getByCategory(category: string): Promise<any>;
    getBuiltInTemplates(): TemplateConfig[];
}
//# sourceMappingURL=template-service.d.ts.map