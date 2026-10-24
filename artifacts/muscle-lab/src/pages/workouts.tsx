import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Cloud, Dumbbell, Info, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useMeta } from '@/hooks/use-meta';
import { newWorkout, type Workout } from '@/lib/workout-storage';
import { guardNav, setUnsavedGuard } from '@/lib/unsaved-guard';
import { useWorkoutRepository, workoutError as msg } from '@/hooks/use-workout-repository';
import { WorkoutEditor } from '@/components/workout-editor';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Pending = { type: 'select'; id: string } | { type: 'new' } | { type: 'close' } | { type: 'nav'; href: string };

const snap = (w: Workout | null) => (w ? JSON.stringify({ n: w.name, o: w.notes, e: w.exercises }) : '');

export default function Workouts() {
  useMeta('My workouts | muscleLab', 'Build routines and keep training notes. Sign in to save privately to your account and open them on any device.');
  const [, navigate] = useLocation();
  const repository = useWorkoutRepository();
  const { list, loadError, cloud, loading } = repository;
  const [draft, setDraft] = useState<Workout | null>(null);
  const [base, setBase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [deleting, setDeleting] = useState<Workout | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copyDialog, setCopyDialog] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const dirty = draft !== null && snap(draft) !== base;

  const request = useCallback((p: Pending) => setPending(p), []);

  useEffect(() => {
    setUnsavedGuard(dirty || saving || copying, (href) => { if (!saving && !copying) request({ type: 'nav', href }); });
    return () => setUnsavedGuard(false, null);
  }, [dirty, saving, copying, request]);

  useEffect(() => {
    if (!dirty && !saving && !copying) return;
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
  }, [dirty, saving, copying]);

  const open = (w: Workout | null) => {
    setDraft(w ? structuredClone(w) : null);
    setIsSaved(Boolean(w));
    setBase(snap(w));
    setError(null);
    setSuccess(null);
  };
  const run = (p: Pending) => {
    if (p.type === 'new') { const w = newWorkout(); setIsSaved(false); setDraft(w); setBase(snap(w)); setError(null); setSuccess(null); }
    else if (p.type === 'select') open(list.find((w) => w.id === p.id) ?? null);
    else if (p.type === 'close') open(null);
    else { setUnsavedGuard(false, null); navigate(p.href); }
  };
  const attempt = (p: Pending) => { if (!saving) { if (dirty) request(p); else run(p); } };

  const save = async () => {
    if (!draft || saving) return;
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
    setSaving(true);
    try {
      const saved = await repository.save(toSave, !isSaved);
      setDraft(structuredClone(saved));
      setBase(snap(saved));
      setIsSaved(true);
      setError(null);
      setSuccess(`Saved "${saved.name}" ${cloud ? 'to your account. Available on your other devices.' : 'in this browser.'}`);
    } catch (e) { setError(msg(e)); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleting || saving) return;
    setSaving(true);
    try {
      await repository.remove(deleting);
      if (draft?.id === deleting.id) open(null);
      setDeleting(null);
      setDeleteError(null);
    } catch (e) {
      setDeleteError(msg(e));
    } finally { setSaving(false); }
  };

  // New data from another device updates an untouched editor, never a dirty draft.
  useEffect(() => {
    if (!isSaved || dirty || saving || loading || loadError) return;
    const current = draft && list.find((w) => w.id === draft.id);
    if (current) {
      setDraft(structuredClone(current));
      setBase(snap(current));
    } else if (draft) {
      open(null);
    }
  }, [list]); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = async () => {
    setRefreshError(null);
    try { await repository.refresh(); } catch (e) { setRefreshError(msg(e)); }
  };
  const copy = async () => {
    setCopying(true);
    setCopyError(null);
    try {
      const result = await repository.copyLocal();
      setCopyMessage(`Copied ${result.imported} routine${result.imported === 1 ? '' : 's'} to your account. ${result.skipped} already in your account and left unchanged. Local copies are still on this device.`);
      setCopyDialog(false);
    } catch (e) { setCopyError(msg(e)); }
    finally { setCopying(false); }
  };

  const sorted = useMemo(() => [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [list]);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-10 md:px-8 md:pt-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#232a16]/70">My workouts</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] text-[#232a16] md:text-7xl">Your own plan, your own notes.</h1>
      <p className="mt-4 max-w-2xl text-lg text-[#232a16]/85">Build named routines from the exercise library and jot down what worked.</p>

      <div className="mt-6 flex max-w-2xl gap-3 rounded-2xl bg-[#232a16] p-4 text-sm text-[#f4f2e9]" data-testid="text-local-notice">
        {cloud ? <Cloud className="mt-0.5 h-4 w-4 shrink-0 text-[#ecf39e]" aria-hidden /> : <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#ecf39e]" aria-hidden />}
        <div>
          {cloud ? (
            <p data-testid="text-cloud-notice">Your routines and notes are saved privately to your account. Sign in to the same account on any device to open them. Save your edits before switching devices.</p>
          ) : (
            <>
              <p>Guest routines are stored only in this browser and can be lost if browser data is cleared. Sign in to save routines to your account and access them on any device.</p>
              <div className="mt-3 flex flex-wrap gap-4">
                <Link href="/sign-in" onClick={(e) => guardNav(e, '/sign-in')} className="font-semibold text-[#ecf39e] underline" data-testid="link-workout-sign-in">Sign in</Link>
                <Link href="/sign-up" onClick={(e) => guardNav(e, '/sign-up')} className="font-semibold text-[#ecf39e] underline">Create account</Link>
              </div>
            </>
          )}
        </div>
      </div>

      {cloud && repository.localCopies.length > 0 && (
        <div className="mt-4 max-w-2xl rounded-2xl bg-[#ecf39e] p-4 text-sm">
          <p>You have {repository.localCopies.length} browser-saved routine{repository.localCopies.length === 1 ? '' : 's'} on this device. They are separate from your account until you copy them.</p>
          <button type="button" disabled={copying || saving} onClick={() => { setCopyError(null); setCopyDialog(true); }} className="mt-3 rounded-full bg-[#232a16] px-4 py-2 font-semibold text-[#f4f2e9] disabled:opacity-50" data-testid="button-copy-local">Copy browser routines to my account</button>
          {copyMessage && <p className="mt-3" role="status">{copyMessage}</p>}
        </div>
      )}
      {cloud && repository.localError && <p role="alert" className="mt-4 text-sm">Browser routines could not be read: {repository.localError} Your account routines are separate and unaffected.</p>}
      {(loadError || refreshError) && <p role="alert" className="mt-4 rounded-xl bg-[#9a3b2b] p-3 text-sm text-[#f4f2e9]" data-testid="text-load-error">{refreshError || loadError}</p>}

      <div className="mt-10 grid gap-6 lg:grid-cols-[320px_1fr]">
        <section aria-labelledby="saved-heading" className="self-start rounded-3xl bg-[#f4f2e9] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="saved-heading" className="font-display text-xl font-bold">Saved routines</h2>
            <div className="flex items-center gap-1">
              <button type="button" onClick={refresh} disabled={saving || repository.fetching} aria-label="Refresh saved routines" title="Refresh saved routines" className="rounded-full p-2 disabled:opacity-40" data-testid="button-refresh-workouts"><RefreshCw className={`h-4 w-4 ${repository.fetching ? 'animate-spin' : ''}`} /></button>
              <button type="button" disabled={saving || loading} onClick={() => attempt({ type: 'new' })} className="flex items-center gap-1.5 rounded-full bg-[#232a16] px-4 py-2 text-sm font-semibold text-[#f4f2e9] disabled:opacity-40" data-testid="button-new-workout"><Plus className="h-4 w-4" aria-hidden />New</button>
            </div>
          </div>
          {loading ? <p className="py-8 text-sm" role="status">Loading your account routines…</p> : sorted.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-[#232a16]/40 p-6 text-center" data-testid="text-empty-list">
              <Dumbbell className="mx-auto h-8 w-8 text-[#232a16]/60" aria-hidden />
              <p className="mt-2 font-display font-bold">{loadError ? 'Saved routines unavailable' : 'Nothing saved yet'}</p>
              <p className="mt-1 text-sm text-[#232a16]/75">{loadError ? 'Try refreshing. Your saved data has not been cleared.' : 'Start a routine and it will show up here.'}</p>
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
                  <button type="button" disabled={saving} onClick={() => { setDeleteError(null); setDeleting(w); }} className="rounded-xl px-3 text-[#9a3b2b] hover:bg-[#9a3b2b]/10 disabled:opacity-40" aria-label={`Delete ${w.name}`} data-testid={`button-delete-${w.id}`}><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Routine editor">
          {draft ? (
            <WorkoutEditor draft={draft} saving={saving} isSaved={isSaved} dirty={dirty} error={error} success={success} onChange={(w) => { setDraft(w); setSuccess(null); }} onSave={save} onClose={() => attempt({ type: 'close' })} onDelete={() => { const w = list.find((x) => x.id === draft.id); if (w) { setDeleteError(null); setDeleting(w); } }} />
          ) : (
            <div className="rounded-3xl border border-[#232a16]/30 p-8 md:p-12" data-testid="text-editor-empty">
              <h2 className="font-display text-2xl font-bold">Pick a routine or start a new one</h2>
              <p className="mt-2 max-w-md text-[#232a16]/85">Name it, add exercises, set your sets and reps, and leave notes for next time.</p>
              <button type="button" disabled={loading || saving} onClick={() => attempt({ type: 'new' })} className="mt-5 rounded-full bg-[#232a16] px-5 py-2.5 text-sm font-semibold text-[#f4f2e9] disabled:opacity-40" data-testid="button-start-workout">Start a routine</button>
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
            <AlertDialogDescription>This removes the routine and its notes {cloud ? 'from your account on every device' : 'from this browser'}. It cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && <p role="alert" className="rounded-xl bg-[#9a3b2b] p-3 text-sm text-[#f4f2e9]">{deleteError}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving} data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={saving} className="bg-[#9a3b2b] text-[#f4f2e9]" data-testid="button-confirm-delete" onClick={(e) => { e.preventDefault(); void confirmDelete(); }}>{saving ? 'Deleting…' : 'Delete routine'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={copyDialog} onOpenChange={(value) => { if (!copying) setCopyDialog(value); }}>
        <AlertDialogContent className="bg-[#f4f2e9] text-[#232a16]">
          <AlertDialogHeader>
            <AlertDialogTitle>Copy browser routines to this account?</AlertDialogTitle>
            <AlertDialogDescription>Your local routines and notes will be copied into the account you are currently signed into. Existing account routines are not overwritten. Local originals will stay in this browser.</AlertDialogDescription>
          </AlertDialogHeader>
          {copyError && <p role="alert" className="text-sm text-[#9a3b2b]">{copyError}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={copying}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={copying} onClick={(e) => { e.preventDefault(); void copy(); }} data-testid="button-confirm-copy">{copying ? 'Copying…' : 'Copy routines'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
