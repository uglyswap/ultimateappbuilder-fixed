/**
 * Visual Editor Service - Drag & Drop UI Builder
 *
 * This service powers the visual editor that allows users to:
 * - Drag & drop UI components
 * - Visually design their application
 * - Generate production-ready code from visual designs
 * - Preview changes in real-time
 */
export interface ComponentDefinition {
    id: string;
    type: string;
    name: string;
    category: 'layout' | 'form' | 'data' | 'navigation' | 'feedback' | 'media';
    props: Record<string, any>;
    children?: ComponentDefinition[];
    styles?: Record<string, any>;
}
export interface PageDesign {
    id: string;
    projectId: string;
    pageName: string;
    route: string;
    components: ComponentDefinition[];
    metadata: {
        title?: string;
        description?: string;
        responsive?: boolean;
    };
}
export declare const COMPONENT_LIBRARY: Record<string, {
    name: string;
    category: string;
    description: string;
    defaultProps: Record<string, any>;
    codeTemplate: string;
}>;
export declare class VisualEditorService {
    /**
     * Create a new visual design
     */
    createDesign(projectId: string, pageName: string, route: string): Promise<PageDesign>;
    /**
     * Add component to design
     */
    addComponent(designId: string, componentType: string, parentId?: string, props?: Record<string, any>): Promise<ComponentDefinition>;
    /**
     * Generate React code from visual design
     */
    generateCodeFromDesign(design: PageDesign): Promise<{
        componentCode: string;
        routeConfig: string;
    }>;
    /**
     * Generate code for a single component
     */
    private generateComponentCode;
    /**
     * Save visual design to database
     */
    saveDesign(design: PageDesign): Promise<void>;
    /**
     * Get component library
     */
    getComponentLibrary(): typeof COMPONENT_LIBRARY;
    /**
     * Get components by category
     */
    getComponentsByCategory(category: string): Array<{
        type: string;
        name: string;
        description: string;
    }>;
    /**
     * Generate complete page from AI description
     */
    generatePageFromDescription(projectId: string, pageName: string, description: string): Promise<PageDesign>;
    /**
     * Helper to convert to PascalCase
     */
    private toPascalCase;
}
export declare const visualEditorService: VisualEditorService;
//# sourceMappingURL=visual-editor-service.d.ts.map