import { Router } from 'express';
import { TemplateController } from '@/api/controllers/template-controller';

const router = Router();
const templateController = new TemplateController();

router.get('/', templateController.list);
router.get('/:id', templateController.get);

export default router;
