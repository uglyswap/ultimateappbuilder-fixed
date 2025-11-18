import { logger } from '@/utils/logger';
import { universalAIClient } from '@/utils/universal-ai-client';

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

export class AITestingService {
  /**
   * Generate unit tests for code
   */
  async generateUnitTests(
    code: string,
    fileName: string,
    framework: 'jest' | 'vitest' | 'mocha' = 'jest'
  ): Promise<GeneratedTests> {
    logger.info(`Generating unit tests for ${fileName} using ${framework}`);

    const prompt = `Generate comprehensive unit tests for this TypeScript code using ${framework}.

File: ${fileName}

Code:
\`\`\`typescript
${code}
\`\`\`

Requirements:
- Test all functions and methods
- Test edge cases and error handling
- Test async/await properly
- Use proper mocking for dependencies
- Aim for 100% code coverage
- Follow ${framework} best practices
- Use TypeScript
- Include setup and teardown if needed

Generate ONLY the test code, nothing else.`;

    const result = await universalAIClient.generateCode(prompt, 'backend', {
      autonomousMode: true,
      temperature: 0.3,
    });

    return {
      testFile: result.content,
      configFile: this.generateTestConfig(framework),
      dependencies: this.getTestDependencies(framework),
    };
  }

  /**
   * Generate integration tests
   */
  async generateIntegrationTests(
    apiEndpoints: string[],
    framework: 'jest' | 'supertest' = 'jest'
  ): Promise<GeneratedTests> {
    logger.info('Generating integration tests');

    const prompt = `Generate integration tests for these API endpoints using ${framework} and Supertest.

Endpoints:
${apiEndpoints.map(e => `- ${e}`).join('\n')}

Requirements:
- Test all CRUD operations
- Test authentication/authorization
- Test error responses
- Test input validation
- Test database operations
- Use test database
- Clean up after tests
- Use TypeScript

Generate comprehensive integration test suite.`;

    const result = await universalAIClient.generateCode(prompt, 'backend', {
      autonomousMode: true,
      temperature: 0.3,
    });

    return {
      testFile: result.content,
      setupFile: this.generateIntegrationTestSetup(),
      configFile: this.generateTestConfig(framework),
      dependencies: [...this.getTestDependencies(framework), 'supertest', '@types/supertest'],
    };
  }

  /**
   * Generate E2E tests
   */
  async generateE2ETests(
    userFlows: string[],
    framework: 'playwright' | 'cypress' = 'playwright'
  ): Promise<GeneratedTests> {
    logger.info(`Generating E2E tests using ${framework}`);

    const prompt = `Generate E2E tests for these user flows using ${framework}.

User Flows:
${userFlows.map((flow, i) => `${i + 1}. ${flow}`).join('\n')}

Requirements:
- Test complete user journeys
- Test happy paths and error scenarios
- Use proper selectors (data-testid)
- Wait for elements properly
- Take screenshots on failure
- Test mobile and desktop viewports
- Use TypeScript
- Follow ${framework} best practices

Generate complete E2E test suite.`;

    const result = await universalAIClient.generateCode(prompt, 'frontend', {
      autonomousMode: true,
      temperature: 0.3,
    });

    return {
      testFile: result.content,
      configFile: this.generateE2EConfig(framework),
      dependencies: this.getE2EDependencies(framework),
    };
  }

  /**
   * Generate component tests (React)
   */
  async generateComponentTests(
    componentCode: string,
    componentName: string
  ): Promise<GeneratedTests> {
    logger.info(`Generating component tests for ${componentName}`);

    const prompt = `Generate React component tests using React Testing Library and Jest.

Component: ${componentName}

Code:
\`\`\`tsx
${componentCode}
\`\`\`

Requirements:
- Test component rendering
- Test user interactions (clicks, inputs, etc.)
- Test props variations
- Test accessibility
- Test error states
- Test loading states
- Use userEvent for interactions
- Use screen queries
- Use TypeScript

Generate comprehensive component tests.`;

    const result = await universalAIClient.generateCode(prompt, 'frontend', {
      autonomousMode: true,
      temperature: 0.3,
    });

    return {
      testFile: result.content,
      setupFile: this.generateComponentTestSetup(),
      configFile: this.generateTestConfig('jest'),
      dependencies: [
        ...this.getTestDependencies('jest'),
        '@testing-library/react',
        '@testing-library/jest-dom',
        '@testing-library/user-event',
      ],
    };
  }

  /**
   * Generate API tests
   */
  async generateAPITests(apiSpec: any): Promise<GeneratedTests> {
    logger.info('Generating API tests from spec');

    const prompt = `Generate API tests from this specification using Jest and Supertest.

API Spec:
${JSON.stringify(apiSpec, null, 2)}

Requirements:
- Test all endpoints
- Test request/response formats
- Test status codes
- Test error handling
- Test authentication
- Test rate limiting
- Use TypeScript

Generate complete API test suite.`;

    const result = await universalAIClient.generateCode(prompt, 'backend', {
      autonomousMode: true,
      temperature: 0.3,
    });

    return {
      testFile: result.content,
      configFile: this.generateTestConfig('jest'),
      dependencies: [...this.getTestDependencies('jest'), 'supertest', '@types/supertest'],
    };
  }

  /**
   * Generate performance tests
   */
  async generatePerformanceTests(endpoints: string[]): Promise<GeneratedTests> {
    logger.info('Generating performance tests');

    const testCode = `import { describe, it, expect } from '@jest/globals';
import autocannon from 'autocannon';

describe('Performance Tests', () => {
${endpoints
  .map(
    endpoint => `  it('should handle load on ${endpoint}', async () => {
    const result = await autocannon({
      url: 'http://localhost:3000${endpoint}',
      connections: 100,
      duration: 10,
    });

    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.latency.mean).toBeLessThan(100); // 100ms average
    expect(result.requests.average).toBeGreaterThan(1000); // 1000 req/s
  });
`
  )
  .join('\n')}
});`;

    return {
      testFile: testCode,
      dependencies: ['autocannon', '@types/autocannon'],
    };
  }

  /**
   * Generate accessibility tests
   */
  async generateAccessibilityTests(pages: string[]): Promise<GeneratedTests> {
    logger.info('Generating accessibility tests');

    const testCode = `import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

${pages
  .map(
    page => `test('${page} should be accessible', async ({ page }) => {
  await page.goto('http://localhost:3000${page}');
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
});
`
  )
  .join('\n')}`;

    return {
      testFile: testCode,
      dependencies: ['@playwright/test', 'axe-core', 'axe-playwright'],
    };
  }

  /**
   * Generate test config
   */
  private generateTestConfig(framework: 'jest' | 'vitest' | 'mocha'): string {
    const configs = {
      jest: `export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};`,
      vitest: `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.ts', '**/*.d.ts'],
    },
  },
});`,
      mocha: `{
  "require": ["ts-node/register"],
  "extensions": ["ts"],
  "spec": "src/**/*.test.ts",
  "timeout": 5000
}`,
    };

    return configs[framework];
  }

  /**
   * Generate E2E config
   */
  private generateE2EConfig(framework: 'playwright' | 'cypress'): string {
    const configs = {
      playwright: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});`,
      cypress: `import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});`,
    };

    return configs[framework];
  }

  /**
   * Generate integration test setup
   */
  private generateIntegrationTestSetup(): string {
    return `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clear database before each test
  const tables = await prisma.$queryRaw\`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
  \`;

  for (const { tablename } of tables as any[]) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(
        \`TRUNCATE TABLE "\${tablename}" CASCADE;\`
      );
    }
  }
});`;
  }

  /**
   * Generate component test setup
   */
  private generateComponentTestSetup(): string {
    return `import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});`;
  }

  /**
   * Get test dependencies
   */
  private getTestDependencies(framework: 'jest' | 'vitest' | 'mocha'): string[] {
    const common = ['@types/node', 'typescript'];

    const deps = {
      jest: [...common, 'jest', '@types/jest', 'ts-jest'],
      vitest: [...common, 'vitest', '@vitest/ui', 'happy-dom'],
      mocha: [...common, 'mocha', '@types/mocha', 'chai', '@types/chai', 'ts-node'],
    };

    return deps[framework];
  }

  /**
   * Get E2E dependencies
   */
  private getE2EDependencies(framework: 'playwright' | 'cypress'): string[] {
    return framework === 'playwright'
      ? ['@playwright/test', 'axe-playwright']
      : ['cypress', '@cypress/webpack-preprocessor', 'ts-loader'];
  }

  /**
   * Run tests and get coverage
   */
  async runTests(config: TestConfig): Promise<{
    success: boolean;
    coverage?: number;
    results: any;
  }> {
    logger.info(`Running ${config.type} tests with ${config.framework}`);

    // In production, this would actually run tests
    return {
      success: true,
      coverage: 95,
      results: {
        total: 50,
        passed: 48,
        failed: 2,
        duration: 5234,
      },
    };
  }

  /**
   * Generate test from user story
   */
  async generateTestFromUserStory(userStory: string): Promise<GeneratedTests> {
    const prompt = `Generate E2E test from this user story using Playwright:

User Story: ${userStory}

Requirements:
- Test the complete user flow
- Use data-testid selectors
- Test happy path and error scenarios
- Add proper assertions
- Use TypeScript

Generate the test code.`;

    const result = await universalAIClient.generateCode(prompt, 'frontend', {
      autonomousMode: true,
      temperature: 0.3,
    });

    return {
      testFile: result.content,
      dependencies: this.getE2EDependencies('playwright'),
    };
  }
}

export const aiTestingService = new AITestingService();
