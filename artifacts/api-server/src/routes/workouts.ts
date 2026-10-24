import { Router, type IRouter } from 'express';
import { getAuth } from '@clerk/express';
import { and, desc, eq } from 'drizzle-orm';
import { db, workoutsTable, type SavedWorkout } from '@workspace/db';
import { DeleteCloudWorkoutBody, ImportWorkoutsBody, SaveCloudWorkoutBody } from '@workspace/api-zod';
import { getClerkProxyHost } from '../middlewares/clerkProxyMiddleware';

const router: IRouter = Router();
const serialize = (w: SavedWorkout) => ({
  id: w.id, name: w.name, notes: w.notes, exercises: w.exercises,
  createdAt: w.createdAt.toISOString(), updatedAt: w.updatedAt.toISOString(),
});
const validContent = (w: { name: string; exercises: { id: string; name: string; reps: string }[]; createdAt: string; updatedAt: string }) =>
  Boolean(w.name.trim()) && Number.isFinite(Date.parse(w.createdAt)) && Number.isFinite(Date.parse(w.updatedAt))
  && w.exercises.every((e) => e.name.trim() && e.reps.trim())
  && new Set(w.exercises.map((e) => e.id)).size === w.exercises.length;

router.use('/workouts', (req, res, next) => {
  if (!getAuth(req).userId) {
    res.status(401).json({ error: 'Sign in to open your cloud workouts.' });
    return;
  }
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') {
    const origin = req.get('origin');
    if (origin) {
      try {
        if (new URL(origin).host !== getClerkProxyHost(req)) {
          res.status(403).json({ error: 'This request must come from muscleLab.' });
          return;
        }
      } catch {
        res.status(403).json({ error: 'Invalid request origin.' });
        return;
      }
    } else if (req.get('sec-fetch-site') === 'cross-site') {
      res.status(403).json({ error: 'Cross-site request refused.' });
      return;
    }
  }
  next();
});

router.get('/workouts', async (req, res): Promise<void> => {
  const rows = await db.select().from(workoutsTable)
    .where(eq(workoutsTable.ownerId, getAuth(req).userId!))
    .orderBy(desc(workoutsTable.updatedAt));
  res.json(rows.map(serialize));
});

router.post('/workouts/import', async (req, res): Promise<void> => {
  const parsed = ImportWorkoutsBody.safeParse(req.body);
  if (!parsed.success || !parsed.data.workouts.every(validContent)) {
    res.status(400).json({ error: 'The browser routines could not be validated. Local copies have not been changed.' });
    return;
  }
  const ownerId = getAuth(req).userId!;
  const values = parsed.data.workouts.map((w) => ({
    ownerId, id: w.id, name: w.name.trim(), notes: w.notes, exercises: w.exercises,
  }));
  // One statement: either the copy succeeds or local data stays untouched.
  // Existing IDs are deliberately skipped, never overwritten on repeated imports.
  const inserted = await db.insert(workoutsTable).values(values).onConflictDoNothing().returning({ id: workoutsTable.id });
  res.json({ imported: inserted.length, skipped: values.length - inserted.length });
});

router.put('/workouts/:id', async (req, res): Promise<void> => {
  const parsed = SaveCloudWorkoutBody.safeParse(req.body);
  const id = String(req.params.id);
  if (!parsed.success || parsed.data.id !== id || !validContent(parsed.data)) {
    res.status(400).json({ error: 'Check the workout name, exercise names, sets and rep targets before saving.' });
    return;
  }
  const ownerId = getAuth(req).userId!;
  const w = parsed.data;
  if (w.isNew) {
    const inserted = await db.insert(workoutsTable).values({
      ownerId, id, name: w.name.trim(), notes: w.notes, exercises: w.exercises,
    }).onConflictDoNothing().returning();
    if (!inserted[0]) {
      res.status(409).json({ error: 'This routine already exists. Refresh your saved routines before editing it.' });
      return;
    }
    res.json(serialize(inserted[0]));
    return;
  }
  const updated = await db.update(workoutsTable).set({
    name: w.name.trim(), notes: w.notes, exercises: w.exercises,
    updatedAt: new Date(Math.max(Date.now(), Date.parse(w.updatedAt) + 1)),
  }).where(and(
    eq(workoutsTable.ownerId, ownerId), eq(workoutsTable.id, id),
    eq(workoutsTable.updatedAt, new Date(w.updatedAt)),
  )).returning();
  if (!updated[0]) {
    res.status(409).json({ error: 'This routine was changed or deleted on another device. Your unsaved draft is still here. Copy your notes, then refresh your saved routines.' });
    return;
  }
  res.json(serialize(updated[0]));
});

router.delete('/workouts/:id', async (req, res): Promise<void> => {
  const parsed = DeleteCloudWorkoutBody.safeParse(req.body);
  const updatedAt = parsed.success ? parsed.data.updatedAt : '';
  if (!Number.isFinite(Date.parse(updatedAt))) {
    res.status(400).json({ error: 'A saved workout version is required.' });
    return;
  }
  const removed = await db.delete(workoutsTable).where(and(
    eq(workoutsTable.ownerId, getAuth(req).userId!),
    eq(workoutsTable.id, String(req.params.id)),
    eq(workoutsTable.updatedAt, new Date(updatedAt)),
  )).returning({ id: workoutsTable.id });
  if (!removed.length) {
    res.status(409).json({ error: 'This routine changed on another device or is no longer available. Refresh your saved routines before deleting.' });
    return;
  }
  res.status(204).end();
});

export default router;
