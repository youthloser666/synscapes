import { Router } from 'express';
import { artistController } from '../controllers/artistController.js';

const router = Router();

router.get('/', artistController.getAll);

export default router;
