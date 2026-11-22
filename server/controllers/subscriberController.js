import { z } from 'zod';
import { subscriberService } from '../services/subscriberService.js';

export const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address.')
});

export const subscriberController = {
  async subscribe(req, res, next) {
    try {
      const { email } = req.body;
      const result = await subscriberService.subscribe(email);

      if (result.isNew) {
        return res.status(201).json({
          success: true,
          message: 'Subscribed successfully to Synscape updates.',
          data: result.subscriber
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Email is already subscribed to updates.',
        data: result.subscriber
      });
    } catch (err) {
      next(err);
    }
  }
};
