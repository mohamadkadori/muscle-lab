import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EXERCISES } from '../data/exercises';
import { resolveExercise, workoutExerciseHref } from './exercise-links';

test('every library exercise resolves without a stored slug', () => {
  for (const exercise of EXERCISES) {
    assert.equal(resolveExercise(exercise.name)?.slug, exercise.slug);
    assert.equal(workoutExerciseHref('routine', {
      id: 'entry', name: exercise.name, exerciseSlug: null,
    }), `/exercises/${exercise.slug}`);
  }
});

test('common coach names, punctuation, plurals and stale IDs resolve', () => {
  const cases = [
    ['Barbell curl', 'barbell-curl'],
    ['Triceps Pushdown', 'tricep-pushdown'],
    ['Dumbbell chest flyes', 'dumbbell-fly'],
    ['Lat pull-down', 'lat-pulldown'],
    ['Pull ups', 'pull-up'],
    ['Leg presses', 'leg-press'],
    ['Crunches', 'crunch'],
    ['RDL', 'romanian-deadlift'],
    ['Single arm dumbbell row', 'one-arm-row'],
    ['Decline push-up', 'incline-push-up'],
  ];
  for (const [name, slug] of cases) {
    assert.equal(resolveExercise(`  ${name.toUpperCase()}  `, 'removed-id')?.slug, slug);
  }
});

test('explicit valid library IDs remain authoritative', () => {
  assert.equal(resolveExercise('My chest exercise', 'incline-dumbbell-press')?.slug, 'incline-dumbbell-press');
});

test('different movements and equipment never get guessed links', () => {
  for (const name of ['Push-Up', 'Incline Push-Up', 'Dumbbell Bench Press',
    'Barbell Overhead Press', 'Dumbbell Front Raise', 'Plank', 'Squat']) {
    assert.equal(resolveExercise(name), undefined, name);
  }
});

test('all non-library entries have private routine detail links without mutating saved data', () => {
  const entry = Object.freeze({
    id: 'exercise/1', name: 'My custom movement', exerciseSlug: null,
    notes: 'Private training note', sets: 4, reps: '10',
  });
  const href = workoutExerciseHref('routine/1', entry);
  assert.equal(href, '/workouts/routine%2F1/exercises/exercise%2F1');
  assert.ok(!href.includes(entry.notes));
  assert.ok(!href.includes(entry.name));
  assert.equal(entry.exerciseSlug, null);
});
