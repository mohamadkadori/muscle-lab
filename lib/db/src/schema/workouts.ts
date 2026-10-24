import { jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

export interface StoredExercise {
  id: string;
  exerciseSlug: string | null;
  name: string;
  sets: number;
  reps: string;
  notes: string;
}

export const workoutsTable = pgTable('workouts', {
  ownerId: text('owner_id').notNull(),
  id: text('id').notNull(),
  name: text('name').notNull(),
  notes: text('notes').notNull().default(''),
  exercises: jsonb('exercises').$type<StoredExercise[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 3 }).notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.ownerId, t.id] })]);

export const insertWorkoutSchema = createInsertSchema(workoutsTable).omit({ createdAt: true, updatedAt: true });
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type SavedWorkout = typeof workoutsTable.$inferSelect;
