"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginSystemService = exports.PluginSystemService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
class PluginSystemService {
    plugins = new Map();
    hooks = new Map();
    /**
     * Register a plugin
     */
    async registerPlugin(plugin) {
        logger_1.logger.info(`Registering plugin: ${plugin.name} v${plugin.version}`);
        this.plugins.set(plugin.id, plugin);
    }
    /**
     * Unregister a plugin
     */
    async unregisterPlugin(pluginId) {
        logger_1.logger.info(`Unregistering plugin: ${pluginId}`);
        this.plugins.delete(pluginId);
    }
    /**
     * Get all plugins
     */
    getAllPlugins() {
        return Array.from(this.plugins.values());
    }
    /**
     * Get plugin by ID
     */
    getPlugin(pluginId) {
        return this.plugins.get(pluginId);
    }
    /**
     * Register a hook
     */
    registerHook(hookName, handler) {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }
        this.hooks.get(hookName).push({ name: hookName, handler });
    }
    /**
     * Execute hooks
     */
    async executeHook(hookName, ...args) {
        const hooks = this.hooks.get(hookName) || [];
        const results = await Promise.all(hooks.map(hook => hook.handler(...args)));
        return results;
    }
    /**
     * Create plugin template
     */
    createPluginTemplate(pluginName, type) {
        return `/**
 * ${pluginName} Plugin
 * Auto-generated plugin template
 */

export default {
  id: '${pluginName.toLowerCase().replace(/\s+/g, '-')}',
  name: '${pluginName}',
  version: '1.0.0',
  description: 'Custom plugin for Ultimate App Builder',
  author: 'Your Name',
  type: '${type}',

  // Plugin entry point
  async init() {
    console.log('${pluginName} plugin initialized');
  },

  // Plugin methods
  async execute(context: any) {
    // Your plugin logic here
    return {
      success: true,
      data: {},
    };
  },

  // Plugin hooks
  hooks: {
    'before:generate': async (data: any) => {
      // Execute before code generation
      return data;
    },
    'after:generate': async (data: any) => {
      // Execute after code generation
      return data;
    },
  },
};
`;
    }
}
exports.PluginSystemService = PluginSystemService;
exports.pluginSystemService = new PluginSystemService();
//# sourceMappingURL=plugin-system-service.js.map