import { archiveService } from '../services/archiveService.js';

export const archiveController = {
  async getSelected(req, res, next) {
    try {
      const work = await archiveService.getSelected();
      res.json({ success: true, data: work });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const works = await archiveService.getAll();
      res.json({ success: true, data: works });
    } catch (err) {
      next(err);
    }
  }
};
