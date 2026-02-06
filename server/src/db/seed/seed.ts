import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  console.log('⏳ Seeding database...');

  await db
    .insert(schema.roles)
    .values([{ name: 'ADMIN' }, { name: 'PARTICIPANT' }])
    .onConflictDoNothing();

  await db
    .insert(schema.categories)
    .values([
      { name: 'Music' },
      { name: 'Technology' },
      { name: 'Art' },
      { name: 'Sports' },
      { name: 'Business' },
      { name: 'Education' },
    ])
    .onConflictDoNothing();
  const createdBy = 'e9f2b6a5-ef1c-49d8-9fba-84dee4fda923';
  const categoryId = 'bb9c938c-4db9-4683-a4cf-e7b8f1ec75bb';
  const baseDate = new Date();
  const seededEvents = Array.from({ length: 20 }, (_, index) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + index + 1);
    date.setHours(9 + (index % 6) * 2, 0, 0, 0);

    return {
      title: `Sample Event ${index + 1}`,
      description: `Auto-generated event ${index + 1} for testing.`,
      date,
      location: `Venue ${index + 1}`,
      capacity: 50 + (index % 5) * 10,
      status: 'PUBLISHED' as const,
      categoryId,
      createdBy,
    };
  });

  await db.insert(schema.events).values(seededEvents);

  console.log('✅ Seeding completed');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed');
  console.error(err);
  process.exit(1);
});
