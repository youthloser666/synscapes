import { Router } from 'express';
import { archiveController } from '../controllers/archiveController.js';

const router = Router();

router.get('/selected', archiveController.getSelected);
router.get('/', archiveController.getAll);

export default router;
