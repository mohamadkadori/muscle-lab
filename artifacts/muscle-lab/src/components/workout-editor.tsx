import { useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Plus, Save, Trash2, X } from 'lucide-react';
import { Link } from 'wouter';
import type { Workout, WorkoutExercise } from '@/lib/workout-storage';
import { newWorkoutExercise } from '@/lib/workout-storage';
import { ExercisePicker } from '@/components/exercise-picker';
import { guardNav } from '@/lib/unsaved-guard';
import { workoutExerciseHref } from '@/lib/exercise-links';

const field = 'w-full rounded-xl border border-[#232a16]/30 bg-white/60 px-3 py-2 text-sm text-[#232a16] placeholder:text-[#232a16]/50';

interface Props {
  draft: Workout;
  isSaved: boolean;
  dirty: boolean;
  error: string | null;
  success: string | null;
  saving?: boolean;
  onChange: (w: Workout) => void;
  onSave: () => void;
  onClose: () => void;
  onDelete: () => void;
}

export function WorkoutEditor({ draft, isSaved, dirty, error, success, saving = false, onChange, onSave, onClose, onDelete }: Props) {
  const [picking, setPicking] = useState(false);
  const setItem = (id: string, patch: Partial<WorkoutExercise>) =>
    onChange({ ...draft, exercises: draft.exercises.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const move = (i: number, d: number) => {
    const list = [...draft.exercises];
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    onChange({ ...draft, exercises: list });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="rounded-3xl bg-[#f4f2e9] p-5 md:p-7" data-testid="form-workout" noValidate>
      <fieldset disabled={saving} aria-busy={saving} className="min-w-0 disabled:opacity-70">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-2xl font-extrabold">{isSaved ? 'Edit routine' : 'New routine'}</h2>
        <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-[#232a16]/10" aria-label="Close editor" data-testid="button-close-editor"><X className="h-5 w-5" /></button>
      </div>

      <label className="mt-4 block text-sm font-semibold" htmlFor="workout-name">Routine name</label>
      <input id="workout-name" className={`${field} mt-1`} value={draft.name} maxLength={120} placeholder="Push day, Leg day basics..." onChange={(e) => onChange({ ...draft, name: e.target.value })} data-testid="input-workout-name" />

      <label className="mt-4 block text-sm font-semibold" htmlFor="workout-notes">Training notes</label>
      <textarea id="workout-notes" rows={3} maxLength={20000} className={`${field} mt-1`} value={draft.notes} placeholder="How it felt, goals, reminders. A routine can be notes only." onChange={(e) => onChange({ ...draft, notes: e.target.value })} data-testid="input-workout-notes" />

      <div className="mt-6 flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold">Exercises <span className="font-mono text-sm font-normal text-[#232a16]/60">({draft.exercises.length})</span></h3>
        <button type="button" onClick={() => setPicking(true)} disabled={draft.exercises.length >= 100} className="disabled:opacity-40 flex items-center gap-1.5 rounded-full bg-[#232a16] px-4 py-2 text-sm font-semibold text-[#f4f2e9]" data-testid="button-add-exercise"><Plus className="h-4 w-4" aria-hidden />Add exercise</button>
      </div>

      {draft.exercises.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-[#232a16]/40 p-5 text-sm text-[#232a16]/80" data-testid="text-no-exercises">
          No exercises yet. Add some from the library, or save this as a notes-only routine.
        </p>
      ) : (
        <ol className="mt-3 space-y-3">
          {draft.exercises.map((x, i) => {
            const href = workoutExerciseHref(draft.id, x);
            return (
            <li key={x.id} className="rounded-2xl border border-[#232a16]/20 bg-white/50 p-4" data-testid={`item-exercise-${x.id}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-mono text-xs text-[#232a16]/60">{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-display text-lg font-bold leading-tight">
                    <Link href={href} onClick={(e) => guardNav(e, href)} className="underline decoration-[#232a16]/30 underline-offset-2 hover:decoration-[#232a16]" data-testid={`link-workout-exercise-${x.id}`}>{x.name}</Link>
                  </p>
                </div>
                <div className="flex shrink-0">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-full p-2 hover:bg-[#232a16]/10 disabled:opacity-30" aria-label={`Move ${x.name} up`}><ChevronUp className="h-4 w-4" /></button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === draft.exercises.length - 1} className="rounded-full p-2 hover:bg-[#232a16]/10 disabled:opacity-30" aria-label={`Move ${x.name} down`}><ChevronDown className="h-4 w-4" /></button>
                  <button type="button" onClick={() => onChange({ ...draft, exercises: draft.exercises.filter((y) => y.id !== x.id) })} className="rounded-full p-2 text-[#9a3b2b] hover:bg-[#9a3b2b]/10" aria-label={`Remove ${x.name}`} data-testid={`button-remove-${x.id}`}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold" htmlFor={`sets-${x.id}`}>Sets</label>
                  <input id={`sets-${x.id}`} type="number" inputMode="numeric" min={1} max={99} className={`${field} mt-1`} value={Number.isFinite(x.sets) ? x.sets : ''} onChange={(e) => setItem(x.id, { sets: e.target.value === '' ? NaN : Number(e.target.value) })} data-testid={`input-sets-${x.id}`} />
                </div>
                <div>
                  <label className="text-xs font-semibold" htmlFor={`reps-${x.id}`}>Reps</label>
                  <input id={`reps-${x.id}`} className={`${field} mt-1`} value={x.reps} maxLength={100} placeholder="8-12" onChange={(e) => setItem(x.id, { reps: e.target.value })} data-testid={`input-reps-${x.id}`} />
                </div>
              </div>
              <label className="mt-3 block text-xs font-semibold" htmlFor={`note-${x.id}`}>Exercise note</label>
              <textarea id={`note-${x.id}`} rows={2} maxLength={10000} className={`${field} mt-1`} value={x.notes} placeholder="Seat height, weight used, cues..." onChange={(e) => setItem(x.id, { notes: e.target.value })} data-testid={`input-note-${x.id}`} />
            </li>
            );
          })}
        </ol>
      )}

      <div aria-live="polite" className="mt-5 space-y-2">
        {error && <p role="alert" className="flex items-start gap-2 rounded-xl bg-[#9a3b2b] p-3 text-sm text-[#f4f2e9]" data-testid="text-save-error"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{error}</p>}
        {success && !error && <p role="status" className="flex items-center gap-2 rounded-xl bg-[#ecf39e] p-3 text-sm font-semibold" data-testid="text-save-success"><CheckCircle2 className="h-4 w-4" aria-hidden />{success}</p>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" className="flex items-center gap-2 rounded-full bg-[#232a16] px-6 py-3 text-sm font-semibold text-[#f4f2e9]" data-testid="button-save-workout"><Save className="h-4 w-4" aria-hidden />{saving ? 'Saving…' : 'Save routine'}</button>
        {dirty && <span className="text-sm font-semibold text-[#232a16]/80" data-testid="text-unsaved">Unsaved changes</span>}
        {isSaved && <button type="button" onClick={onDelete} className="ml-auto flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-[#9a3b2b] hover:bg-[#9a3b2b]/10" data-testid="button-delete-workout"><Trash2 className="h-4 w-4" aria-hidden />Delete</button>}
      </div>

      <ExercisePicker open={picking} onOpenChange={setPicking} onPick={(e) => { onChange({ ...draft, exercises: [...draft.exercises, newWorkoutExercise(e.name, e.slug)] }); setPicking(false); }} />
      </fieldset>
    </form>
  );
}
