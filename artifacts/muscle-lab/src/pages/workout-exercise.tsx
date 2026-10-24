import { Link, Redirect, useParams } from 'wouter';
import { useWorkoutRepository } from '@/hooks/use-workout-repository';
import { useMeta } from '@/hooks/use-meta';
import { resolveExercise } from '@/lib/exercise-links';

// Uses the existing account-scoped repository. Never put private exercise notes
// in the URL or fall back to another account's / guest routines.
export default function WorkoutExercisePage() {
  const { workoutId, exerciseId } = useParams<{ workoutId: string; exerciseId: string }>();
  const repo = useWorkoutRepository();
  const workout = repo.list.find(w => w.id === workoutId);
  const exercise = workout?.exercises.find(e => e.id === exerciseId);
  const match = exercise ? resolveExercise(exercise.name, exercise.exerciseSlug) : undefined;
  useMeta(
    exercise ? `${exercise.name} — muscleLab` : 'Routine exercise — muscleLab',
    'View the sets, rep target and training notes for an exercise in your routine.',
  );

  if (match) return <Redirect to={`/exercises/${match.slug}`} />;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-12">
      <Link href="/workouts" className="text-sm font-semibold underline underline-offset-4">← My workouts</Link>
      {repo.loading ? <p className="mt-8" role="status">Loading your exercise…</p> : repo.loadError ? (
        <div className="mt-8" role="alert">
          <p>{repo.loadError}</p>
          <button type="button" className="mt-4 rounded-full bg-[#232a16] px-5 py-2 text-[#f4f2e9]" onClick={() => { void repo.refresh().catch(() => {}); }}>Try again</button>
        </div>
      ) : exercise ? (
        <article className="mt-6 rounded-3xl bg-[#f4f2e9] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#232a16]/60">From {workout!.name}</p>
          <h1 className="mt-2 break-words font-display text-3xl font-extrabold md:text-4xl">{exercise.name}</h1>
          <dl className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#232a16]/15 p-4"><dt className="text-sm text-[#232a16]/65">Sets</dt><dd className="mt-1 text-xl font-bold">{exercise.sets}</dd></div>
            <div className="rounded-2xl border border-[#232a16]/15 p-4"><dt className="text-sm text-[#232a16]/65">Reps</dt><dd className="mt-1 break-words text-xl font-bold">{exercise.reps}</dd></div>
          </dl>
          <h2 className="mt-6 font-display text-xl font-bold">Exercise notes</h2>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{exercise.notes || 'No exercise notes yet. Add your cues and reminders in My workouts.'}</p>
          <p className="mt-6 border-t border-[#232a16]/15 pt-4 text-sm text-[#232a16]/70">This exercise does not yet have a matching guide in our library. These are your saved routine details; a demonstration is not available here yet.</p>
          <Link href="/exercises" className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">Browse exercise guides</Link>
        </article>
      ) : (
        <div className="mt-8">
          <h1 className="font-display text-2xl font-bold">Exercise not available</h1>
          <p className="mt-3 text-sm">Open the account or browser where this routine is saved. If this is a new exercise, save the routine before opening its details.</p>
        </div>
      )}
    </div>
  );
}
