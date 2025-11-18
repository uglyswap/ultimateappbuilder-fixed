import { Router } from 'express';
import { GenerationController } from '@/api/controllers/generation-controller';

const router = Router();
const generationController = new GenerationController();

router.get('/', generationController.list);
router.get('/:id', generationController.get);

export default router;
