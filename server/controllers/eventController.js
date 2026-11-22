import { eventService } from '../services/eventService.js';

export const eventController = {
  async getFeatured(req, res, next) {
    try {
      const event = await eventService.getFeatured();
      res.json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const events = await eventService.getAll();
      res.json({ success: true, data: events });
    } catch (err) {
      next(err);
    }
  }
};
