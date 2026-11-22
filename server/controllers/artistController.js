import { artistService } from '../services/artistService.js';

export const artistController = {
  async getAll(req, res, next) {
    try {
      const roster = await artistService.getAllGrouped();
      res.json({ success: true, data: roster });
    } catch (err) {
      next(err);
    }
  }
};
