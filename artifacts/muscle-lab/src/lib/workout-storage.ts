export interface WorkoutExercise {
  id: string;
  exerciseSlug: string | null;
  name: string;
  sets: number;
  reps: string;
  notes: string;
}

export interface Workout {
  id: string;
  name: string;
  notes: string;
  exercises: WorkoutExercise[];
  createdAt: string;
  updatedAt: string;
}

export const WORKOUT_STORAGE_KEY = 'musclelab.workouts.v1';

const text = (v: unknown, max: number): v is string => typeof v === 'string' && v.length <= max;
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const date = (v: unknown): v is string => typeof v === 'string' && Number.isFinite(Date.parse(v));

function validExercise(value: unknown): value is WorkoutExercise {
  if (!record(value)) return false;
  return text(value.id, 100) && value.id.length > 0
    && (value.exerciseSlug === null || text(value.exerciseSlug, 200))
    && text(value.name, 200) && value.name.trim().length > 0
    && typeof value.sets === 'number' && Number.isInteger(value.sets) && value.sets >= 1 && value.sets <= 99
    && text(value.reps, 100) && value.reps.trim().length > 0
    && text(value.notes, 10000);
}

function validWorkout(value: unknown): value is Workout {
  if (!record(value)) return false;
  return text(value.id, 100) && value.id.length > 0
    && text(value.name, 120) && value.name.trim().length > 0
    && text(value.notes, 20000)
    && Array.isArray(value.exercises) && value.exercises.length <= 100
    && value.exercises.every(validExercise)
    && new Set(value.exercises.map((e: WorkoutExercise) => e.id)).size === value.exercises.length
    && date(value.createdAt) && date(value.updatedAt);
}

function storage(): Storage {
  try {
    return window.localStorage;
  } catch {
    throw new Error('Browser storage is unavailable. Allow site storage to save your workouts.');
  }
}

export function loadWorkouts(): Workout[] {
  let raw: string | null;
  try {
    raw = storage().getItem(WORKOUT_STORAGE_KEY);
  } catch {
    throw new Error('Your browser could not read saved workouts. Check that site storage is enabled.');
  }
  if (raw === null) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!record(data) || data.version !== 1 || !Array.isArray(data.workouts)
      || !data.workouts.every(validWorkout)
      || new Set(data.workouts.map((w: Workout) => w.id)).size !== data.workouts.length) {
      throw new Error('Invalid workout data');
    }
    return [...data.workouts].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  } catch {
    // Never replace unreadable saved data with an empty list.
    throw new Error('Saved workout data could not be read. It has not been changed or overwritten.');
  }
}

function persist(workouts: Workout[]) {
  try {
    storage().setItem(WORKOUT_STORAGE_KEY, JSON.stringify({ version: 1, workouts }));
  } catch {
    throw new Error('Your browser could not save changes. Storage may be full or disabled. Keep this page open and try again.');
  }
}

export function saveWorkout(workout: Workout): void {
  if (!validWorkout(workout)) {
    throw new Error('Add a workout name (up to 120 characters). Each exercise needs a name, 1–99 sets and a rep target. Keep workout notes under 20,000 characters and exercise notes under 10,000.');
  }
  const workouts = loadWorkouts();
  const existing = workouts.find((w) => w.id === workout.id);
  if (existing && existing.updatedAt !== workout.updatedAt) {
    throw new Error('This workout was changed in another tab. Copy your unsaved notes before reopening the saved workout.');
  }
  const saved: Workout = {
    id: workout.id,
    name: workout.name.trim(),
    notes: workout.notes,
    exercises: workout.exercises.map((e) => ({
      id: e.id, exerciseSlug: e.exerciseSlug, name: e.name.trim(),
      sets: e.sets, reps: e.reps.trim(), notes: e.notes,
    })),
    createdAt: existing?.createdAt ?? workout.createdAt,
    updatedAt: new Date().toISOString(),
  };
  persist([saved, ...workouts.filter((w) => w.id !== workout.id)]);
}

export function deleteWorkout(id: string): void {
  persist(loadWorkouts().filter((w) => w.id !== id));
}

export function newWorkout(): Workout {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(), name: '', notes: '', exercises: [],
    createdAt: now, updatedAt: now,
  };
}

export function newWorkoutExercise(name: string, exerciseSlug: string | null = null): WorkoutExercise {
  return { id: crypto.randomUUID(), exerciseSlug, name, sets: 3, reps: '8–12', notes: '' };
}
