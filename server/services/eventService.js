import { db } from '../config/db.js';

export const eventService = {
  async getFeatured() {
    return db.event.findFirst({ where: { isUpcoming: true } });
  },

  async getAll() {
    return db.event.findMany();
  }
};
