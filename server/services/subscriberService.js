import { db } from '../config/db.js';

export const subscriberService = {
  async subscribe(email, source = 'landing_footer') {
    const existing = await db.subscriber.findUnique({
      where: { email }
    });

    if (existing) {
      return { subscriber: existing, isNew: false };
    }

    const created = await db.subscriber.create({
      data: { email, source }
    });

    return { subscriber: created, isNew: true };
  }
};
