import { Router } from 'express';
import { cloudinaryService } from '../config/cloudinary.js';

const router = Router();

router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      isAvailable: cloudinaryService.isAvailable(),
      service: 'Cloudinary'
    }
  });
});

export default router;
