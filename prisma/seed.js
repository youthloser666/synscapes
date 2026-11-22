import { getDbClient } from '../src/config/db.js';

async function seed() {
  console.log('🌱 Starting Synscape database seeding...');
  const prisma = await getDbClient();

  if (prisma.event?.create) {
    await prisma.event.create({
      data: {
        title: 'SYNESCAPE SESSION III',
        sessionCode: 'UPCOMING EVENT / 001',
        dateText: 'SAT. DEC 12 2026',
        location: 'BELGRADE, RS',
        bannerUrl: '/banner.png',
        ticketUrl: 'https://synscape.ticket/session-3',
        isUpcoming: true
      }
    });
    console.log('✅ Seeded featured event');
  }

  console.log('🎉 Seeding completed successfully.');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
