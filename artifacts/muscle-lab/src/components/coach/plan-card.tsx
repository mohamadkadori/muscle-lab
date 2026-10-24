import { useRef, useState } from 'react';
import { Link } from 'wouter';
import { Check, Loader2 } from 'lucide-react';
import type { CoachRoutine } from '@workspace/api-client-react';
import { resolveExercise } from '@/lib/exercise-links';
import { newWorkout, newWorkoutExercise, type Workout } from '@/lib/workout-storage';
import { useWorkoutRepository, workoutError } from '@/hooks/use-workout-repository';

type Repo = ReturnType<typeof useWorkoutRepository>;

function buildWorkout(plan: CoachRoutine): Workout {
  const w = newWorkout();
  w.name = plan.name.trim().slice(0, 120) || 'Coach routine';
  w.notes = plan.notes ?? '';
  w.exercises = plan.exercises.map((e) => {
    const match = resolveExercise(e.name);
    const ex = newWorkoutExercise(e.name.trim().slice(0, 200), match ? match.slug : null);
    ex.sets = Math.min(99, Math.max(1, Math.round(e.sets) || 3));
    ex.reps = e.reps.trim().slice(0, 100) || '8-12';
    ex.notes = e.notes ?? '';
    return ex;
  });
  return w;
}

export function PlanCard({ plan, index, repo, onBusy }: {
  plan: CoachRoutine; index: number; repo: Repo; onBusy: (busy: boolean) => void;
}) {
  const draft = useRef<Workout | null>(null);
  if (!draft.current) draft.current = buildWorkout(plan);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  const save = async () => {
    if (busy.current || status === 'saved') return;
    busy.current = true; setStatus('saving'); setError(null); onBusy(true);
    const w = draft.current!;
    try {
      await repo.save(w, true);
      setStatus('saved');
    } catch (e) {
      try {
        const rows = await repo.refresh();
        if (rows.some((r) => r.id === w.id)) { setStatus('saved'); return; }
      } catch { /* fall through to error */ }
      setError(workoutError(e)); setStatus('idle');
    } finally {
      busy.current = false; onBusy(false);
    }
  };

  const saved = status === 'saved';
  return (
    <article className="rounded-2xl border border-[#232a16]/15 bg-[#f4f2e9] p-4" data-testid={`card-plan-${index}`}>
      <h3 className="font-display text-lg font-bold text-[#232a16]">{plan.name}</h3>
      {plan.notes && <p className="mt-1 whitespace-pre-wrap text-sm text-[#232a16]/80">{plan.notes}</p>}
      <ol className="mt-3 divide-y divide-[#232a16]/10 text-sm">
        {plan.exercises.map((e, i) => (
          <li key={i} className="py-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="font-semibold">{e.name}</span>
              <span className="font-mono text-xs">{e.sets} sets x {e.reps}</span>
            </div>
            {e.notes && <p className="whitespace-pre-wrap text-xs text-[#232a16]/70">{e.notes}</p>}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-[#232a16]/70">
        {repo.cloud ? 'Saves to your private account.' : 'Saves in this browser only. Sign in to keep it in your account.'}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={status !== 'idle'} data-testid={`button-save-plan-${index}`}
          className="inline-flex items-center gap-2 rounded-full bg-[#232a16] px-4 py-2 text-sm font-semibold text-[#ecf39e] disabled:opacity-60">
          {status === 'saving' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {saved && <Check className="h-4 w-4" aria-hidden />}
          {saved ? 'Saved' : status === 'saving' ? 'Saving...' : error ? 'Retry save' : 'Save to My workouts'}
        </button>
        {saved && <Link href="/workouts" className="text-sm font-semibold underline" data-testid={`link-edit-plan-${index}`}>Edit in My workouts</Link>}
      </div>
      <div role="status" aria-live="polite">
        {error && <p className="mt-2 text-sm font-semibold text-[#a63a2b]" data-testid={`text-save-error-${index}`}>{error} Nothing was duplicated; you can retry.</p>}
      </div>
    </article>
  );
}
