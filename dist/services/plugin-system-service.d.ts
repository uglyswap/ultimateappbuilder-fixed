/**
 * Plugin System Service
 *
 * Extensible plugin architecture for:
 * - Custom code generators
 * - Custom templates
 * - Custom AI models
 * - Custom deployment targets
 * - Hooks & middleware
 */
export interface Plugin {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    type: 'generator' | 'template' | 'ai-model' | 'deployment' | 'middleware';
    entry: string;
    config?: Record<string, any>;
    enabled: boolean;
}
export interface PluginHook {
    name: string;
    handler: (...args: any[]) => Promise<any>;
}
export declare class PluginSystemService {
    private plugins;
    private hooks;
    /**
     * Register a plugin
     */
    registerPlugin(plugin: Plugin): Promise<void>;
    /**
     * Unregister a plugin
     */
    unregisterPlugin(pluginId: string): Promise<void>;
    /**
     * Get all plugins
     */
    getAllPlugins(): Plugin[];
    /**
     * Get plugin by ID
     */
    getPlugin(pluginId: string): Plugin | undefined;
    /**
     * Register a hook
     */
    registerHook(hookName: string, handler: PluginHook['handler']): void;
    /**
     * Execute hooks
     */
    executeHook(hookName: string, ...args: any[]): Promise<any[]>;
    /**
     * Create plugin template
     */
    createPluginTemplate(pluginName: string, type: Plugin['type']): string;
}
export declare const pluginSystemService: PluginSystemService;
//# sourceMappingURL=plugin-system-service.d.ts.map