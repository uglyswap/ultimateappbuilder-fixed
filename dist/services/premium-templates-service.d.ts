/**
 * Premium Templates Library
 * World-class, production-ready application templates
 */
export declare class PremiumTemplatesService {
    /**
     * Get all premium templates with filtering and search
     */
    getAllTemplates(options?: {
        category?: string;
        isPremium?: boolean;
        isOfficial?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    /**
     * Initialize premium templates library
     */
    seedPremiumTemplates(): Promise<{
        categories: any[];
        templates: any[];
    }>;
    private createCategories;
    private createPremiumTemplates;
}
export declare const premiumTemplatesService: PremiumTemplatesService;
//# sourceMappingURL=premium-templates-service.d.ts.map