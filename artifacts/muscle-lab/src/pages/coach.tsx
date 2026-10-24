import { useEffect, useRef, useState, type FormEvent } from 'react';
import { askCoach } from '@workspace/api-client-react';
import { useMeta } from '@/hooks/use-meta';
import { useWorkoutRepository, workoutError } from '@/hooks/use-workout-repository';
import { PlanCard } from '@/components/coach/plan-card';
import { buildHistory, MAX_USER_CHARS, type TranscriptItem } from '@/lib/coach-history';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const STARTER = `Goal: \nDays per week: \nEquipment: \nExperience: \nSession length: \nMovements to avoid (optional, no medical details): `;

export default function Coach() {
  useMeta('AI coach | muscleLab', 'Ask general fitness questions and review draft workout plans before saving them.');
  const repo = useWorkoutRepository();
  const [items, setItems] = useState<TranscriptItem[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [secs, setSecs] = useState(0);
  const ctl = useRef<AbortController | null>(null);
  const sending = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => ctl.current?.abort(), []);
  useEffect(() => {
    if (!pending) return;
    setSecs(0);
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [pending]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); }, [items.length, pending]);

  const text = input.trim();
  const tooLong = input.length > MAX_USER_CHARS;

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    if (sending.current || !text || tooLong) return;
    sending.current = true; setPending(true); setError(null);
    const userItem: TranscriptItem = { id: crypto.randomUUID(), role: 'user', content: text };
    const c = new AbortController();
    ctl.current = c;
    try {
      const messages = buildHistory([...items, userItem]);
      const res = await askCoach({ messages }, { credentials: 'include', signal: c.signal });
      if (c.signal.aborted || ctl.current !== c) return;
      setItems((p) => [...p, userItem, { id: crypto.randomUUID(), role: 'assistant', content: res.reply, workouts: res.workouts }]);
      setInput('');
    } catch (err) {
      if (c.signal.aborted) return;
      setError(workoutError(err));
    } finally {
      if (ctl.current === c) {
        sending.current = false;
        if (!c.signal.aborted) setPending(false);
        ctl.current = null;
      }
    }
  };

  const reset = () => {
    ctl.current?.abort(); ctl.current = null; sending.current = false;
    setItems([]); setInput(''); setError(null); setPending(false); setConfirm(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 pt-10 md:px-8 md:pt-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#232a16]/70">AI coach</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] text-[#232a16] md:text-7xl">Ask the coach.</h1>
      <p className="mt-4 max-w-2xl text-[#232a16]/85">
        Ask training questions or request a draft plan. Review it first; nothing is saved until you press save.
      </p>
      <div className="mt-4 rounded-2xl bg-[#ecf39e] p-4 text-sm text-[#232a16]" data-testid="text-disclaimer">
        General fitness information only, not medical advice. The AI can be wrong. Do not share names, health records or other sensitive details.
        Your workouts and account data are never sent automatically. This chat lives only in this page and is lost on reload.
        {!repo.cloud && ' You are signed out, so saved routines stay in this browser only.'}
      </div>

      <section className="mt-6 rounded-3xl bg-[#f4f2e9] p-4 md:p-6" aria-label="Conversation">
        <div className="space-y-4" aria-live="polite">
          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#232a16]/30 p-6 text-center" data-testid="empty-coach">
              <p className="font-display text-xl font-bold">No conversation yet</p>
              <p className="mt-1 text-sm text-[#232a16]/75">Fill in a plan profile to get a tailored draft, or ask a training question.</p>
              <button type="button" onClick={() => setInput(STARTER)} data-testid="button-starter"
                className="mt-3 rounded-full bg-[#232a16] px-4 py-2 text-sm font-semibold text-[#ecf39e]">Use plan profile</button>
            </div>
          )}
          {items.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'ml-auto max-w-[90%]' : 'max-w-full'} data-testid={`message-${m.role}-${m.id}`}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-[#232a16]/60">{m.role === 'user' ? 'You' : 'Coach'}</p>
              <p className={`whitespace-pre-wrap break-words rounded-2xl p-4 text-sm ${m.role === 'user' ? 'bg-[#232a16] text-[#f4f2e9]' : 'bg-white/70'}`}>{m.content}</p>
              {m.workouts && m.workouts.length > 0 && (
                <div className="mt-3 space-y-3">
                  <p className="text-xs font-semibold text-[#232a16]/70">Draft routines for review</p>
                  {m.workouts.map((w, i) => (
                    <PlanCard key={`${m.id}-${i}`} plan={w} index={i} repo={repo}
                      onBusy={(b) => setSaving((n) => Math.max(0, n + (b ? 1 : -1)))} />
                  ))}
                </div>
              )}
            </div>
          ))}
          {pending && (
            <div className="animate-pulse rounded-2xl bg-white/70 p-4 text-sm" role="status" data-testid="status-waiting">
              The coach is thinking ({secs}s). This may take a little while.
            </div>
          )}
          <div ref={endRef} />
        </div>

        {error && (
          <div role="alert" className="mt-4 rounded-2xl border border-[#a63a2b] bg-[#f6dcd6] p-3 text-sm text-[#7a2a1e]" data-testid="text-coach-error">
            {error} Your message is still in the box.
            <button type="button" onClick={() => send()} className="ml-3 font-bold underline" data-testid="button-retry">Retry</button>
          </div>
        )}

        <form onSubmit={send} className="mt-4">
          <label htmlFor="coach-input" className="text-sm font-semibold">Your message</label>
          <textarea id="coach-input" value={input} onChange={(e) => setInput(e.target.value)} rows={6} disabled={pending}
            data-testid="input-coach"
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(); }}
            className="mt-1 w-full rounded-xl border-[1.5px] border-[#232a16] bg-white p-3 text-sm" />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <span className={`font-mono text-xs ${tooLong ? 'font-bold text-[#a63a2b]' : 'text-[#232a16]/60'}`}>{input.length}/{MAX_USER_CHARS}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setConfirm(true)} disabled={saving > 0 || (!items.length && !input && !error)}
                data-testid="button-reset" className="rounded-full border-[1.5px] border-[#232a16] px-4 py-2 text-sm font-semibold disabled:opacity-50">
                {saving > 0 ? 'Saving...' : 'Clear chat'}
              </button>
              <button type="submit" disabled={pending || !text || tooLong} data-testid="button-send"
                className="rounded-full bg-[#232a16] px-5 py-2 text-sm font-semibold text-[#ecf39e] disabled:opacity-50">
                {pending ? 'Waiting...' : 'Ask coach'}
              </button>
            </div>
          </div>
        </form>
      </section>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear this conversation?</AlertDialogTitle>
            <AlertDialogDescription>The chat and any unsaved draft routines will be discarded. Saved routines stay in My workouts.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep chatting</AlertDialogCancel>
            <AlertDialogAction onClick={reset} data-testid="button-confirm-reset">Clear</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
