import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['ADMIN', 'PARTICIPANT']);

export const statusEnum = pgEnum('status', [
  'PENDING',
  'CONFIRMED',
  'CANCELED',
]);

export const eventStatusEnum = pgEnum('event_status', [
  'UPCOMING',
  'ONGOING',
  'COMPLETED',
  'CANCELED',
]);

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).unique().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password').notNull(),
  roleId: uuid('role_id').references(() => roles.id),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).unique().notNull(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
  date: timestamp('date').notNull(),
  location: varchar('location', { length: 255 }),
  capacity: integer('capacity').notNull(),
  status: eventStatusEnum('status').default('UPCOMING'),
  categoryId: uuid('category_id').references(() => categories.id),
  createdBy: uuid('created_by').references(() => users.id),
});

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  eventId: uuid('event_id').references(() => events.id),
  status: statusEnum('status').default('PENDING'),
});
