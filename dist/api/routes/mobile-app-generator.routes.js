"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mobile_app_generator_service_1 = require("../../services/mobile-app-generator-service");
const logger_1 = require("../../utils/logger");
const router = (0, express_1.Router)();
/**
 * POST /api/mobile/generate
 * Generate complete React Native mobile app
 */
router.post('/generate', async (req, res) => {
    try {
        const config = req.body;
        if (!config.projectId || !config.appName || !config.bundleId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: projectId, appName, bundleId',
            });
        }
        const result = await mobile_app_generator_service_1.mobileAppGeneratorService.generateMobileApp(config);
        return res.json({
            success: true,
            ...result,
            message: 'React Native mobile app generated! Ready for iOS & Android! 📱',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate mobile app', { error });
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate mobile app',
        });
    }
});
/**
 * POST /api/mobile/build/ios
 * Generate iOS build configuration
 */
router.post('/build/ios', async (req, res) => {
    try {
        const config = await mobile_app_generator_service_1.mobileAppGeneratorService.generateIOSBuildConfig();
        return res.json({
            success: true,
            config,
            message: 'iOS build configuration generated! 🍎',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate iOS build config', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate iOS build configuration',
        });
    }
});
/**
 * POST /api/mobile/build/android
 * Generate Android build configuration
 */
router.post('/build/android', async (req, res) => {
    try {
        const config = await mobile_app_generator_service_1.mobileAppGeneratorService.generateAndroidBuildConfig();
        return res.json({
            success: true,
            config,
            message: 'Android build configuration generated! 🤖',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate Android build config', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate Android build configuration',
        });
    }
});
exports.default = router;
//# sourceMappingURL=mobile-app-generator.routes.js.map