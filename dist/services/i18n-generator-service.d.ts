/**
 * Internationalization (i18n) Generator Service
 *
 * Generates multi-language support for applications:
 * - Translation files for multiple languages
 * - i18next integration
 * - React i18n components
 * - Language detection
 * - RTL support for Arabic, Hebrew, etc.
 * - Locale-specific formatting (dates, numbers, currency)
 */
export interface I18nConfig {
    defaultLanguage: string;
    supportedLanguages: string[];
    namespace?: string;
}
export declare class I18nGeneratorService {
    /**
     * Generate i18n configuration
     */
    generateI18nSetup(config: I18nConfig): Promise<{
        translations: Record<string, Record<string, any>>;
        i18nConfig: string;
        reactSetup: string;
        languageSwitcher: string;
    }>;
    /**
     * Generate translations using AI
     */
    private generateTranslations;
    /**
     * Generate i18n configuration
     */
    private generateI18nConfig;
    /**
     * Generate React i18n setup
     */
    private generateReactSetup;
    /**
     * Generate language switcher component
     */
    private generateLanguageSwitcher;
    /**
     * Get language display name
     */
    private getLanguageName;
    /**
     * Generate RTL support
     */
    generateRTLSupport(): string;
    /**
     * Generate locale-specific formatting
     */
    generateLocaleFormatting(): string;
}
export declare const i18nGeneratorService: I18nGeneratorService;
//# sourceMappingURL=i18n-generator-service.d.ts.map