import { Router, Request, Response } from 'express';
import { mobileAppGeneratorService } from '@/services/mobile-app-generator-service';
import { logger } from '@/utils/logger';

const router = Router();

/**
 * POST /api/mobile/generate
 * Generate complete React Native mobile app
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const config = req.body;

    if (!config.projectId || !config.appName || !config.bundleId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: projectId, appName, bundleId',
      });
    }

    const result = await mobileAppGeneratorService.generateMobileApp(config);

    return res.json({
      success: true,
      ...result,
      message: 'React Native mobile app generated! Ready for iOS & Android! 📱',
    });
  } catch (error) {
    logger.error('Failed to generate mobile app', { error });
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
router.post('/build/ios', async (req: Request, res: Response) => {
  try {
    const config = await mobileAppGeneratorService.generateIOSBuildConfig();

    return res.json({
      success: true,
      config,
      message: 'iOS build configuration generated! 🍎',
    });
  } catch (error) {
    logger.error('Failed to generate iOS build config', { error });
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
router.post('/build/android', async (req: Request, res: Response) => {
  try {
    const config = await mobileAppGeneratorService.generateAndroidBuildConfig();

    return res.json({
      success: true,
      config,
      message: 'Android build configuration generated! 🤖',
    });
  } catch (error) {
    logger.error('Failed to generate Android build config', { error });
    return res.status(500).json({
      success: false,
      error: 'Failed to generate Android build configuration',
    });
  }
});

export default router;
