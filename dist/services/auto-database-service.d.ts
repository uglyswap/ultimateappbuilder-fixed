export type DatabaseType = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'supabase' | 'planetscale' | 'neon' | 'railway';
export interface DatabaseConfig {
    type: DatabaseType;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    ssl?: boolean;
}
export interface AutoDatabaseResult {
    success: boolean;
    connectionString: string;
    schema?: string;
    migrations?: string[];
    seedData?: any;
    error?: string;
}
/**
 * Auto Database Creation Service
 * AUTONOMOUS MODE: Automatically creates and configures databases
 * No manual setup required!
 */
export declare class AutoDatabaseService {
    /**
     * Automatically create and setup database based on project requirements
     * Analyzes the project config and generates optimal schema
     */
    autoCreateDatabase(projectConfig: {
        name: string;
        template: string;
        features: string[];
        description?: string;
    }): Promise<AutoDatabaseResult>;
    /**
     * Generate database schema using AI based on project requirements
     */
    private generateSchemaFromRequirements;
    /**
     * Choose optimal database type based on project characteristics
     */
    private chooseOptimalDatabaseType;
    /**
     * Create database instance on cloud provider
     * In production, this would use provider APIs to create actual databases
     */
    private createDatabaseInstance;
    /**
     * Apply schema to database
     */
    private applySchema;
    /**
     * Generate realistic seed data using AI
     */
    private generateSeedData;
    /**
     * Get all available database presets
     */
    getDatabasePresets(): Promise<any[]>;
    /**
     * Create a new database preset
     */
    createDatabasePreset(preset: {
        name: string;
        description: string;
        type: string;
        connectionString: string;
        schema?: any;
        provider?: string;
        providerConfig?: any;
    }): Promise<any>;
    /**
     * Seed default database presets
     */
    seedDatabasePresets(): Promise<any[]>;
}
export declare const autoDatabaseService: AutoDatabaseService;
//# sourceMappingURL=auto-database-service.d.ts.map