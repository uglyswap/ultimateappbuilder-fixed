"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_testing_service_1 = require("../../services/ai-testing-service");
const logger_1 = require("../../utils/logger");
const router = (0, express_1.Router)();
/**
 * POST /api/testing/unit
 * Generate unit tests for code
 */
router.post('/unit', async (req, res) => {
    try {
        const { code, fileName, framework } = req.body;
        if (!code || !fileName) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: code, fileName',
            });
        }
        const tests = await ai_testing_service_1.aiTestingService.generateUnitTests(code, fileName, framework);
        return res.json({
            success: true,
            ...tests,
            message: '✅ Unit tests generated with AI!',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate unit tests', { error });
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate unit tests',
        });
    }
});
/**
 * POST /api/testing/integration
 * Generate integration tests
 */
router.post('/integration', async (req, res) => {
    try {
        const { apiEndpoints, framework } = req.body;
        if (!apiEndpoints || !Array.isArray(apiEndpoints)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: apiEndpoints (array)',
            });
        }
        const tests = await ai_testing_service_1.aiTestingService.generateIntegrationTests(apiEndpoints, framework);
        return res.json({
            success: true,
            ...tests,
            message: '✅ Integration tests generated!',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate integration tests', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate integration tests',
        });
    }
});
/**
 * POST /api/testing/e2e
 * Generate E2E tests
 */
router.post('/e2e', async (req, res) => {
    try {
        const { userFlows, framework } = req.body;
        if (!userFlows || !Array.isArray(userFlows)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: userFlows (array)',
            });
        }
        const tests = await ai_testing_service_1.aiTestingService.generateE2ETests(userFlows, framework);
        return res.json({
            success: true,
            ...tests,
            message: '✅ E2E tests generated with Playwright/Cypress!',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate E2E tests', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate E2E tests',
        });
    }
});
/**
 * POST /api/testing/component
 * Generate React component tests
 */
router.post('/component', async (req, res) => {
    try {
        const { componentCode, componentName } = req.body;
        if (!componentCode || !componentName) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: componentCode, componentName',
            });
        }
        const tests = await ai_testing_service_1.aiTestingService.generateComponentTests(componentCode, componentName);
        return res.json({
            success: true,
            ...tests,
            message: '✅ Component tests generated with React Testing Library!',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate component tests', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate component tests',
        });
    }
});
/**
 * POST /api/testing/api
 * Generate API tests from spec
 */
router.post('/api', async (req, res) => {
    try {
        const { apiSpec } = req.body;
        if (!apiSpec) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: apiSpec',
            });
        }
        const tests = await ai_testing_service_1.aiTestingService.generateAPITests(apiSpec);
        return res.json({
            success: true,
            ...tests,
            message: '✅ API tests generated!',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate API tests', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate API tests',
        });
    }
});
/**
 * POST /api/testing/performance
 * Generate performance tests
 */
router.post('/performance', async (req, res) => {
    try {
        const { endpoints } = req.body;
        if (!endpoints || !Array.isArray(endpoints)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: endpoints (array)',
            });
        }
        const tests = await ai_testing_service_1.aiTestingService.generatePerformanceTests(endpoints);
        return res.json({
            success: true,
            ...tests,
            message: '✅ Performance tests generated with autocannon!',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate performance tests', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate performance tests',
        });
    }
});
/**
 * POST /api/testing/accessibility
 * Generate accessibility tests
 */
router.post('/accessibility', async (req, res) => {
    try {
        const { pages } = req.body;
        if (!pages || !Array.isArray(pages)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: pages (array)',
            });
        }
        const tests = await ai_testing_service_1.aiTestingService.generateAccessibilityTests(pages);
        return res.json({
            success: true,
            ...tests,
            message: '✅ Accessibility tests generated with axe-core!',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate accessibility tests', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate accessibility tests',
        });
    }
});
/**
 * POST /api/testing/from-user-story
 * Generate test from user story
 */
router.post('/from-user-story', async (req, res) => {
    try {
        const { userStory } = req.body;
        if (!userStory) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: userStory',
            });
        }
        const tests = await ai_testing_service_1.aiTestingService.generateTestFromUserStory(userStory);
        return res.json({
            success: true,
            ...tests,
            message: '✅ Test generated from user story!',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate test from user story', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate test from user story',
        });
    }
});
/**
 * POST /api/testing/run
 * Run tests and get results
 */
router.post('/run', async (req, res) => {
    try {
        const config = req.body;
        const results = await ai_testing_service_1.aiTestingService.runTests(config);
        return res.json({
            ...results,
            message: results.success ? '✅ All tests passed!' : '❌ Some tests failed',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to run tests', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to run tests',
        });
    }
});
/**
 * GET /api/testing/frameworks
 * Get supported test frameworks
 */
router.get('/frameworks', async (req, res) => {
    try {
        const frameworks = {
            unit: [
                {
                    id: 'jest',
                    name: 'Jest',
                    description: 'Delightful JavaScript Testing',
                    features: ['Zero config', 'Snapshot testing', 'Coverage', 'Mocking'],
                },
                {
                    id: 'vitest',
                    name: 'Vitest',
                    description: 'Blazing fast unit test framework',
                    features: ['Vite-powered', 'Jest compatible', 'Fast', 'TypeScript'],
                },
                {
                    id: 'mocha',
                    name: 'Mocha',
                    description: 'Flexible testing framework',
                    features: ['Flexible', 'Extensible', 'Async support', 'Browser support'],
                },
            ],
            e2e: [
                {
                    id: 'playwright',
                    name: 'Playwright',
                    description: 'Modern E2E testing framework',
                    features: ['Cross-browser', 'Auto-wait', 'Parallel', 'Screenshots'],
                },
                {
                    id: 'cypress',
                    name: 'Cypress',
                    description: 'Fast, easy and reliable testing',
                    features: ['Time travel', 'Real-time reload', 'Screenshots', 'Videos'],
                },
            ],
        };
        return res.json({
            success: true,
            frameworks,
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to get frameworks', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to get frameworks',
        });
    }
});
exports.default = router;
//# sourceMappingURL=testing.routes.js.map