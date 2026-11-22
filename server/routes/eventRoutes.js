import { Router } from 'express';
import { eventController } from '../controllers/eventController.js';

const router = Router();

router.get('/featured', eventController.getFeatured);
router.get('/', eventController.getAll);

export default router;
