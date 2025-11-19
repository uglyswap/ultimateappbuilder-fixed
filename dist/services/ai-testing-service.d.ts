/**
 * AI-Powered Testing Service
 *
 * Automated test generation using AI:
 * - Unit tests (Jest, Vitest, Mocha)
 * - Integration tests
 * - E2E tests (Playwright, Cypress)
 * - API tests (Supertest)
 * - Component tests (React Testing Library)
 * - Performance tests
 * - Security tests
 * - Accessibility tests
 */
export interface TestConfig {
    framework: 'jest' | 'vitest' | 'mocha' | 'playwright' | 'cypress';
    type: 'unit' | 'integration' | 'e2e' | 'api' | 'component';
    coverage?: boolean;
    parallel?: boolean;
}
export interface GeneratedTests {
    testFile: string;
    setupFile?: string;
    configFile?: string;
    dependencies: string[];
    coverage?: number;
}
export declare class AITestingService {
    /**
     * Generate unit tests for code
     */
    generateUnitTests(code: string, fileName: string, framework?: 'jest' | 'vitest' | 'mocha'): Promise<GeneratedTests>;
    /**
     * Generate integration tests
     */
    generateIntegrationTests(apiEndpoints: string[], framework?: 'jest' | 'vitest' | 'mocha'): Promise<GeneratedTests>;
    /**
     * Generate E2E tests
     */
    generateE2ETests(userFlows: string[], framework?: 'playwright' | 'cypress'): Promise<GeneratedTests>;
    /**
     * Generate component tests (React)
     */
    generateComponentTests(componentCode: string, componentName: string): Promise<GeneratedTests>;
    /**
     * Generate API tests
     */
    generateAPITests(apiSpec: any): Promise<GeneratedTests>;
    /**
     * Generate performance tests
     */
    generatePerformanceTests(endpoints: string[]): Promise<GeneratedTests>;
    /**
     * Generate accessibility tests
     */
    generateAccessibilityTests(pages: string[]): Promise<GeneratedTests>;
    /**
     * Generate test config
     */
    private generateTestConfig;
    /**
     * Generate E2E config
     */
    private generateE2EConfig;
    /**
     * Generate integration test setup
     */
    private generateIntegrationTestSetup;
    /**
     * Generate component test setup
     */
    private generateComponentTestSetup;
    /**
     * Get test dependencies
     */
    private getTestDependencies;
    /**
     * Get E2E dependencies
     */
    private getE2EDependencies;
    /**
     * Run tests and get coverage
     */
    runTests(config: TestConfig): Promise<{
        success: boolean;
        coverage?: number;
        results: any;
    }>;
    /**
     * Generate test from user story
     */
    generateTestFromUserStory(userStory: string): Promise<GeneratedTests>;
}
export declare const aiTestingService: AITestingService;
//# sourceMappingURL=ai-testing-service.d.ts.map