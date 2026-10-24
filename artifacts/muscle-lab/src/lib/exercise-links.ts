import { EXERCISES, getExercise } from '../data/exercises';

// Deliberately match known equivalents, not fuzzy substrings: a dumbbell press
// must never silently become a barbell press or a different incline.
export function normalizeExerciseName(name: string): string {
  return name.toLowerCase().normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/dumbbells/g, 'dumbbell')
    .replace(/triceps/g, 'tricep')
    .replace(/biceps/g, 'bicep')
    .replace(/flyes|flies/g, 'fly')
    .replace(/[^a-z0-9]/g, '');
}

const aliases: Record<string, string[]> = {
  'incline-push-up': ['Decline Push-Up', 'Feet Elevated Push-Up'],
  'barbell-bench-press': ['Bench Press', 'Flat Barbell Bench Press'],
  'dumbbell-fly': ['Flat Dumbbell Fly', 'Dumbbell Chest Fly'],
  'overhead-press': ['Dumbbell Shoulder Press', 'Dumbbell Overhead Press', 'Seated Dumbbell Shoulder Press'],
  'lateral-raise': ['Dumbbell Lateral Raise', 'Dumbbell Side Raise'],
  'face-pull': ['Cable Face Pull'],
  'reverse-fly': ['Dumbbell Reverse Fly', 'Rear Delt Dumbbell Fly'],
  'barbell-curl': ['Barbell Curl', 'Barbell Bicep Curl', 'Standing Barbell Bicep Curl'],
  'incline-curl': ['Incline Dumbbell Bicep Curl'],
  'preacher-curl': ['Preacher Bicep Curl'],
  'hammer-curl': ['Dumbbell Hammer Curl'],
  'wrist-curl': ['Wrist Curl'],
  'farmer-carry': ["Farmer's Walk", 'Farmer Carry', 'Farmers Carry'],
  'crunch': ['Crunch', 'Crunches', 'Abdominal Crunch'],
  'cable-crunch': ['Cable Crunch'],
  'hanging-knee-raise': ['Hanging Knee Raises'],
  'russian-twist': ['Russian Twists'],
  'pallof-press': ['Cable Pallof Press'],
  'bulgarian-split-squat': ['Rear Foot Elevated Split Squat'],
  'dumbbell-shrug': ['Dumbbell Shrugs'],
  'tricep-pushdown': ['Tricep Pushdown', 'Cable Tricep Pushdown', 'Tricep Cable Pushdown', 'Tricep Push Down'],
  'overhead-extension': ['Overhead Dumbbell Tricep Extension', 'Dumbbell Overhead Tricep Extension'],
  'bench-dip': ['Bench Dips'],
  'lat-pulldown': ['Lat Pull Down', 'Cable Lat Pulldown'],
  'pull-up': ['Pull Ups'],
  'one-arm-row': ['Single Arm Dumbbell Row', 'Dumbbell Row', 'One Arm Row'],
  'seated-cable-row': ['Cable Row'],
  'back-extension': ['Back Extensions'],
  'good-morning': ['Good Morning', 'Good Mornings'],
  'hip-thrust': ['Hip Thrust'],
  'banded-lateral-walk': ['Lateral Band Walk', 'Band Side Steps'],
  'romanian-deadlift': ['RDL', 'Barbell Romanian Deadlift'],
  'lying-leg-curl': ['Lying Hamstring Curl', 'Prone Leg Curl'],
  'single-leg-rdl': ['Single Leg RDL'],
};

const byName = new Map(EXERCISES.map(e => [normalizeExerciseName(e.name), e]));
for (const [slug, names] of Object.entries(aliases)) {
  const exercise = getExercise(slug);
  if (!exercise) throw new Error(`Unknown exercise alias target: ${slug}`);
  for (const name of names) byName.set(normalizeExerciseName(name), exercise);
}
// Plural exercise labels are common in generated routines (e.g. leg presses).
for (const [name, exercise] of [...byName]) {
  const plural = name + (name.endsWith('s') ? 'es' : 's');
  if (!byName.has(plural)) byName.set(plural, exercise);
}

export function resolveExercise(name: string, slug?: string | null) {
  return (slug ? getExercise(slug) : undefined) ?? byName.get(normalizeExerciseName(name));
}

export function workoutExerciseHref(workoutId: string, exercise: { id: string; name: string; exerciseSlug: string | null }) {
  const match = resolveExercise(exercise.name, exercise.exerciseSlug);
  return match
    ? `/exercises/${match.slug}`
    : `/workouts/${encodeURIComponent(workoutId)}/exercises/${encodeURIComponent(exercise.id)}`;
}
