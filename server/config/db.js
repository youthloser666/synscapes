import dotenv from 'dotenv';
dotenv.config();

let prismaInstance = null;

// Initial mock baseline store providing immediate fallback if database is offline
const memoryStore = {
  events: [
    {
      id: 'evt_001',
      title: 'SYNESCAPE SESSION III',
      sessionCode: 'UPCOMING EVENT / 001',
      dateText: 'SAT. DEC 12 2026',
      location: 'BELGRADE, RS',
      bannerUrl: '/banner.png',
      ticketUrl: 'https://synscape.ticket/session-3',
      isUpcoming: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  artists: [
    { id: 'art_001', name: 'SAJAAK', roleType: 'DJ', city: 'Belgrade', genre: 'Dark Techno', avatarUrl: null, isFeatured: true },
    { id: 'art_002', name: 'LU/STT', roleType: 'DJ', city: 'Berlin', genre: 'Industrial', avatarUrl: null, isFeatured: true },
    { id: 'art_003', name: 'VOUG', roleType: 'DJ', city: 'Vienna', genre: 'Hypnotic Groove', avatarUrl: null, isFeatured: true },
    { id: 'art_004', name: 'BYEDOV', roleType: 'DJ', city: 'Belgrade', genre: 'Modular Live', avatarUrl: null, isFeatured: true },
    { id: 'art_005', name: 'YUKIYA', roleType: 'VISUAL_ARTIST', city: 'Tokyo', genre: 'Live Generative', avatarUrl: null, isFeatured: true },
    { id: 'art_006', name: 'MANTRA', roleType: 'VISUAL_ARTIST', city: 'Belgrade', genre: 'Laser Installation', avatarUrl: null, isFeatured: true },
    { id: 'art_007', name: 'SYNTHIA', roleType: 'VISUAL_ARTIST', city: 'London', genre: 'Audioreactive', avatarUrl: null, isFeatured: true },
    { id: 'art_008', name: 'KINETIC', roleType: 'VISUAL_ARTIST', city: 'Amsterdam', genre: 'Scenography', avatarUrl: null, isFeatured: true }
  ],
  archiveWorks: [
    {
      id: 'arc_001',
      title: 'SYNESCAPE SESSION 001',
      sessionCode: 'SESSION 001',
      recordingDate: '01 Sept 2024',
      location: 'Belgrade / Mama Shelter Rooftop',
      videoUrl: '/LANDING.mp4',
      thumbnailUrl: '/banner.png',
      description: 'Recorded Live Performance',
      isSelected: true
    }
  ],
  subscribers: []
};

// Mock Prisma adapter allowing offline execution
const fallbackPrisma = {
  event: {
    findFirst: async ({ where } = {}) => {
      if (where?.isUpcoming !== undefined) {
        return memoryStore.events.find(e => e.isUpcoming === where.isUpcoming) || memoryStore.events[0];
      }
      return memoryStore.events[0];
    },
    findMany: async () => memoryStore.events,
    create: async ({ data }) => {
      const created = { id: `evt_${Date.now()}`, ...data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.events.push(created);
      return created;
    }
  },
  artist: {
    findMany: async ({ where } = {}) => {
      if (where?.roleType) {
        return memoryStore.artists.filter(a => a.roleType === where.roleType);
      }
      return memoryStore.artists;
    }
  },
  archiveWork: {
    findFirst: async () => memoryStore.archiveWorks[0],
    findMany: async () => memoryStore.archiveWorks
  },
  subscriber: {
    findUnique: async ({ where }) => {
      return memoryStore.subscribers.find(s => s.email.toLowerCase() === where.email.toLowerCase()) || null;
    },
    create: async ({ data }) => {
      const subscriber = {
        id: `sub_${Date.now()}`,
        email: data.email,
        isActive: true,
        source: data.source || 'landing_footer',
        subscribedAt: new Date()
      };
      memoryStore.subscribers.push(subscriber);
      return subscriber;
    }
  }
};

export async function getDbClient() {
  if (prismaInstance) return prismaInstance;

  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql://')) {
    try {
      const { PrismaClient } = await import('@prisma/client');
      prismaInstance = new PrismaClient();
      await prismaInstance.$connect();
      console.log('✅ Connected to Supabase PostgreSQL via Prisma.');
      return prismaInstance;
    } catch (err) {
      console.warn('⚠️ Could not connect to Supabase database. Falling back to local store:', err.message);
      return fallbackPrisma;
    }
  }

  return fallbackPrisma;
}

export const db = fallbackPrisma;
