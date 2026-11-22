import { db } from '../config/db.js';

export const archiveService = {
  async getSelected() {
    return db.archiveWork.findFirst({ where: { isSelected: true } });
  },

  async getAll() {
    return db.archiveWork.findMany();
  }
};
