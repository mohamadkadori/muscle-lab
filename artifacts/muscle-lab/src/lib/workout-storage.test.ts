import { strict as assert } from 'node:assert';
import { test, beforeEach } from 'node:test';
import {
  WORKOUT_STORAGE_KEY, loadWorkouts, saveWorkout, deleteWorkout, newWorkout, newWorkoutExercise,
} from './workout-storage.ts';

const saved = new Map<string, string>();
let failWrite = false;
const localStorage = {
  getItem: (key: string) => saved.get(key) ?? null,
  setItem: (key: string, value: string) => {
    if (failWrite) throw new Error('QuotaExceededError');
    saved.set(key, value);
  },
};
Object.defineProperty(globalThis, 'window', { value: { localStorage }, configurable: true });

beforeEach(() => { saved.clear(); failWrite = false; });

test('creates note-only routines, persists edits and deletes without affecting other routines', () => {
  assert.deepEqual(loadWorkouts(), []);
  const first = { ...newWorkout(), name: 'Push day', notes: 'Keep it easy' };
  saveWorkout(first);
  const second = { ...newWorkout(), name: 'Leg day' };
  saveWorkout(second);
  const draft = loadWorkouts().find((w) => w.id === first.id)!;
  draft.notes = 'Start with warm-up sets';
  draft.exercises = [{ ...newWorkoutExercise('Bench Press', 'bench-press'), sets: 4, reps: '6–8', notes: 'Controlled tempo' }];
  saveWorkout(draft);
  const restored = loadWorkouts().find((w) => w.id === first.id)!;
  assert.equal(restored.notes, 'Start with warm-up sets');
  assert.equal(restored.exercises[0].sets, 4);
  assert.equal(restored.exercises[0].notes, 'Controlled tempo');
  deleteWorkout(first.id);
  assert.deepEqual(loadWorkouts().map((w) => w.id), [second.id]);
});

test('failed writes retain existing saved routines', () => {
  saveWorkout({ ...newWorkout(), name: 'Original' });
  const original = saved.get(WORKOUT_STORAGE_KEY);
  failWrite = true;
  assert.throws(() => saveWorkout({ ...newWorkout(), name: 'Another' }), /could not save/);
  assert.equal(saved.get(WORKOUT_STORAGE_KEY), original);
  assert.equal(loadWorkouts().length, 1);
});

test('unreadable data is never silently discarded or overwritten', () => {
  saved.set(WORKOUT_STORAGE_KEY, '{bad json');
  assert.throws(loadWorkouts, /not been changed/);
  assert.throws(() => saveWorkout({ ...newWorkout(), name: 'New' }), /not been changed/);
  assert.throws(() => deleteWorkout('x'), /not been changed/);
  assert.equal(saved.get(WORKOUT_STORAGE_KEY), '{bad json');
});

test('validation prevents blank titles and invalid exercise prescriptions', () => {
  assert.throws(() => saveWorkout(newWorkout()), /workout name/);
  const w = { ...newWorkout(), name: 'Test', exercises: [{ ...newWorkoutExercise('Row'), sets: 0 }] };
  assert.throws(() => saveWorkout(w), /1–99 sets/);
  assert.deepEqual(loadWorkouts(), []);
});

test('rejects a stale edit from another tab', () => {
  saveWorkout({ ...newWorkout(), name: 'Original' });
  const stale = loadWorkouts()[0];
  const payload = JSON.parse(saved.get(WORKOUT_STORAGE_KEY)!);
  payload.workouts[0].updatedAt = '2099-01-01T00:00:00.000Z';
  saved.set(WORKOUT_STORAGE_KEY, JSON.stringify(payload));
  assert.throws(() => saveWorkout({ ...stale, notes: 'stale edit' }), /another tab/);
  assert.equal(loadWorkouts()[0].notes, '');
});
