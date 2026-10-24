import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Dumbbell, Info, Plus, Trash2 } from 'lucide-react';
import { useMeta } from '@/hooks/use-meta';
import { deleteWorkout, loadWorkouts, newWorkout, saveWorkout, type Workout } from '@/lib/workout-storage';
import { setUnsavedGuard } from '@/lib/unsaved-guard';
import { WorkoutEditor } from '@/components/workout-editor';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Pending = { type: 'select'; id: string } | { type: 'new' } | { type: 'close' } | { type: 'nav'; href: string };

const msg = (e: unknown) => (e instanceof Error && e.message ? e.message : 'Something went wrong. Please try again.');
const snap = (w: Workout | null) => (w ? JSON.stringify({ n: w.name, o: w.notes, e: w.exercises }) : '');

function safeLoad(): { list: Workout[]; error: string | null } {
  try { return { list: loadWorkouts(), error: null }; } catch (e) { return { list: [], error: msg(e) }; }
}

export default function Workouts() {
  useMeta('My workouts | muscleLab', 'Build your own routines from the muscleLab exercise library and keep training notes, saved privately in this browser.');
  const [, navigate] = useLocation();
  const [init] = useState(safeLoad);
  const [list, setList] = useState<Workout[]>(init.list);
  const [loadError, setLoadError] = useState<string | null>(init.error);
  const [draft, setDraft] = useState<Workout | null>(null);
  const [base, setBase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [deleting, setDeleting] = useState<Workout | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const dirty = draft !== null && snap(draft) !== base;
  const isSaved = draft !== null && list.some((w) => w.id === draft.id);

  const request = useCallback((p: Pending) => setPending(p), []);

  useEffect(() => {
    setUnsavedGuard(dirty, (href) => request({ type: 'nav', href }));
    return () => setUnsavedGuard(false, null);
  }, [dirty, request]);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    const editorUrl = window.location.href;
    const protectBack = (e: PopStateEvent) => {
      if (window.location.href === editorUrl) return;
      if (window.confirm('Leave this page and discard your unsaved routine changes?')) return;
      // Run before the router's popstate listener, so cancelling keeps the editor mounted.
      e.stopImmediatePropagation();
      window.history.pushState(null, '', editorUrl);
    };
    window.addEventListener('beforeunload', h);
    window.addEventListener('popstate', protectBack, true);
    return () => {
      window.removeEventListener('beforeunload', h);
      window.removeEventListener('popstate', protectBack, true);
    };
  }, [dirty]);

  const open = (w: Workout | null) => {
    setDraft(w ? structuredClone(w) : null);
    setBase(snap(w));
    setError(null);
    setSuccess(null);
  };
  const run = (p: Pending) => {
    if (p.type === 'new') { const w = newWorkout(); setDraft(w); setBase(snap(w)); setError(null); setSuccess(null); }
    else if (p.type === 'select') open(list.find((w) => w.id === p.id) ?? null);
    else if (p.type === 'close') open(null);
    else { setUnsavedGuard(false, null); navigate(p.href); }
  };
  const attempt = (p: Pending) => (dirty ? request(p) : run(p));

  const save = () => {
    if (!draft) return;
    setSuccess(null);
    const name = draft.name.trim();
    if (!name) return setError('Give your routine a name before saving.');
    if (name.length > 120) return setError('Routine names can be up to 120 characters.');
    if (draft.notes.length > 20000) return setError('Routine notes can be up to 20,000 characters.');
    if (draft.exercises.length > 100) return setError('A routine can hold up to 100 exercises.');
    for (const x of draft.exercises) {
      if (x.notes.length > 10000) return setError(`Notes for ${x.name} can be up to 10,000 characters.`);
      if (x.reps.trim().length > 100) return setError(`Reps for ${x.name} can be up to 100 characters.`);
      if (!Number.isInteger(x.sets) || x.sets < 1 || x.sets > 99) return setError(`Sets for ${x.name} must be a whole number from 1 to 99.`);
      if (!x.reps.trim()) return setError(`Add a rep target for ${x.name}, like 8-12.`);
    }
    const toSave: Workout = { ...draft, name, exercises: draft.exercises.map((x) => ({ ...x, reps: x.reps.trim() })) };
    try {
      saveWorkout(toSave);
    } catch (e) {
      return setError(msg(e));
    }
    const r = safeLoad();
    if (r.error) {
      setLoadError(r.error);
      setError('The save completed, but saved workouts could not be reloaded. Keep your draft open and try again.');
      return;
    }
    setList(r.list);
    setLoadError(r.error);
    const saved = r.list.find((w) => w.id === toSave.id) ?? toSave;
    setDraft(structuredClone(saved));
    setBase(snap(saved));
    setError(null);
    setSuccess(`Saved "${saved.name}" in this browser.`);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    try {
      deleteWorkout(deleting.id);
    } catch (e) {
      return setDeleteError(msg(e));
    }
    const r = safeLoad();
    setList(r.list);
    setLoadError(r.error);
    if (draft?.id === deleting.id) open(null);
    setDeleting(null);
    setDeleteError(null);
  };

  const sorted = useMemo(() => [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [list]);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-10 md:px-8 md:pt-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#232a16]/70">My workouts</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] text-[#232a16] md:text-7xl">Your own plan, your own notes.</h1>
      <p className="mt-4 max-w-2xl text-lg text-[#232a16]/85">Build named routines from the exercise library and jot down what worked.</p>

      <div className="mt-6 flex max-w-2xl gap-3 rounded-2xl bg-[#232a16] p-4 text-sm text-[#f4f2e9]" data-testid="text-local-notice">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#ecf39e]" aria-hidden />
        <p>Workouts are stored only in this browser on this device. They do not sync across devices, and clearing your browser data will delete them.</p>
      </div>

      {loadError && <p role="alert" className="mt-4 rounded-xl bg-[#9a3b2b] p-3 text-sm text-[#f4f2e9]" data-testid="text-load-error">{loadError}</p>}

      <div className="mt-10 grid gap-6 lg:grid-cols-[320px_1fr]">
        <section aria-labelledby="saved-heading" className="self-start rounded-3xl bg-[#f4f2e9] p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 id="saved-heading" className="font-display text-xl font-bold">Saved routines</h2>
            <button type="button" onClick={() => attempt({ type: 'new' })} className="flex items-center gap-1.5 rounded-full bg-[#232a16] px-4 py-2 text-sm font-semibold text-[#f4f2e9]" data-testid="button-new-workout"><Plus className="h-4 w-4" aria-hidden />New</button>
          </div>
          {sorted.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-[#232a16]/40 p-6 text-center" data-testid="text-empty-list">
              <Dumbbell className="mx-auto h-8 w-8 text-[#232a16]/60" aria-hidden />
              <p className="mt-2 font-display font-bold">Nothing saved yet</p>
              <p className="mt-1 text-sm text-[#232a16]/75">Start a routine and it will show up here.</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {sorted.map((w) => (
                <li key={w.id} className="flex items-stretch gap-1">
                  <button
                    type="button"
                    onClick={() => attempt({ type: 'select', id: w.id })}
                    aria-current={draft?.id === w.id ? 'true' : undefined}
                    data-testid={`button-workout-${w.id}`}
                    className={`min-w-0 flex-1 rounded-xl px-4 py-3 text-left ${draft?.id === w.id ? 'bg-[#ecf39e]' : 'bg-white/50 hover:bg-[#ecf39e]/60'}`}
                  >
                    <span className="block truncate font-display font-bold">{w.name}</span>
                    <span className="block text-xs text-[#232a16]/70">{w.exercises.length === 0 ? 'Notes only' : `${w.exercises.length} exercise${w.exercises.length === 1 ? '' : 's'}`} · {new Date(w.updatedAt).toLocaleDateString()}</span>
                  </button>
                  <button type="button" onClick={() => { setDeleteError(null); setDeleting(w); }} className="rounded-xl px-3 text-[#9a3b2b] hover:bg-[#9a3b2b]/10" aria-label={`Delete ${w.name}`} data-testid={`button-delete-${w.id}`}><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Routine editor">
          {draft ? (
            <WorkoutEditor draft={draft} isSaved={isSaved} dirty={dirty} error={error} success={success} onChange={(w) => { setDraft(w); setSuccess(null); }} onSave={save} onClose={() => attempt({ type: 'close' })} onDelete={() => { const w = list.find((x) => x.id === draft.id); if (w) { setDeleteError(null); setDeleting(w); } }} />
          ) : (
            <div className="rounded-3xl border border-[#232a16]/30 p-8 md:p-12" data-testid="text-editor-empty">
              <h2 className="font-display text-2xl font-bold">Pick a routine or start a new one</h2>
              <p className="mt-2 max-w-md text-[#232a16]/85">Name it, add exercises, set your sets and reps, and leave notes for next time.</p>
              <button type="button" onClick={() => attempt({ type: 'new' })} className="mt-5 rounded-full bg-[#232a16] px-5 py-2.5 text-sm font-semibold text-[#f4f2e9]" data-testid="button-start-workout">Start a routine</button>
            </div>
          )}
        </section>
      </div>

      <AlertDialog open={pending !== null} onOpenChange={(o) => { if (!o) setPending(null); }}>
        <AlertDialogContent className="bg-[#f4f2e9] text-[#232a16]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>Your edits to this routine have not been saved and will be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-keep-editing">Keep editing</AlertDialogCancel>
            <AlertDialogAction className="bg-[#9a3b2b] text-[#f4f2e9]" data-testid="button-discard" onClick={() => { const p = pending; setPending(null); if (p) run(p); }}>Discard changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleting !== null} onOpenChange={(o) => { if (!o) { setDeleting(null); setDeleteError(null); } }}>
        <AlertDialogContent className="bg-[#f4f2e9] text-[#232a16]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete "{deleting?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This removes the routine and its notes from this browser. It cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && <p role="alert" className="rounded-xl bg-[#9a3b2b] p-3 text-sm text-[#f4f2e9]">{deleteError}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-[#9a3b2b] text-[#f4f2e9]" data-testid="button-confirm-delete" onClick={(e) => { e.preventDefault(); confirmDelete(); }}>Delete routine</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
