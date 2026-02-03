import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';
import * as dotenv from 'dotenv';

dotenv.config();

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

  console.log('✅ Seeding completed!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed!');
  console.error(err);
  process.exit(1);
});
