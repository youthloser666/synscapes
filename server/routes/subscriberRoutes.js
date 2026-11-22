import { Router } from 'express';
import { subscriberController, subscribeSchema } from '../controllers/subscriberController.js';
import { validateBody } from '../middlewares/validate.js';

const router = Router();

router.post('/subscribe', validateBody(subscribeSchema), subscriberController.subscribe);

export default router;
