/**
 * Mobile App Generator Service - React Native
 *
 * Generates production-ready mobile apps with:
 * - React Native + TypeScript
 * - Expo for easy development
 * - Navigation (React Navigation)
 * - State management (Zustand/Redux)
 * - API integration
 * - Authentication (biometric, social)
 * - Push notifications
 * - Offline support
 * - iOS & Android support
 */
export interface MobileAppConfig {
    projectId: string;
    appName: string;
    bundleId: string;
    description: string;
    features: string[];
    platform: 'ios' | 'android' | 'both';
    uiFramework: 'native-base' | 'react-native-paper' | 'rn-elements';
    stateManagement: 'zustand' | 'redux' | 'mobx';
    authentication: boolean;
    pushNotifications: boolean;
    offlineSupport: boolean;
}
export interface MobileScreen {
    name: string;
    route: string;
    type: 'stack' | 'tab' | 'drawer' | 'modal';
    components: any[];
    requiresAuth: boolean;
}
export declare class MobileAppGeneratorService {
    /**
     * Generate complete React Native app
     */
    generateMobileApp(config: MobileAppConfig): Promise<{
        projectStructure: any;
        packageJson: string;
        appJson: string;
        navigation: string;
        screens: Record<string, string>;
        components: Record<string, string>;
        apiClient: string;
        stateStore: string;
    }>;
    /**
     * Generate package.json
     */
    private generatePackageJson;
    /**
     * Generate app.json (Expo configuration)
     */
    private generateAppJson;
    /**
     * Generate navigation structure using AI
     */
    private generateNavigation;
    /**
     * Generate screens using AI
     */
    private generateScreens;
    /**
     * Generate reusable components
     */
    private generateComponents;
    /**
     * Generate API client
     */
    private generateApiClient;
    /**
     * Generate state store
     */
    private generateStateStore;
    /**
     * Generate project structure
     */
    private generateProjectStructure;
    /**
     * Generate iOS build configuration
     */
    generateIOSBuildConfig(): Promise<string>;
    /**
     * Generate Android build configuration
     */
    generateAndroidBuildConfig(): Promise<string>;
}
export declare const mobileAppGeneratorService: MobileAppGeneratorService;
//# sourceMappingURL=mobile-app-generator-service.d.ts.map