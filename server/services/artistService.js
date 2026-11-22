import { db } from '../config/db.js';

export const artistService = {
  async getAllGrouped() {
    const djs = await db.artist.findMany({ where: { roleType: 'DJ' } });
    const visualArtists = await db.artist.findMany({ where: { roleType: 'VISUAL_ARTIST' } });
    return { djs, visualArtists };
  }
};
