import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EXERCISES, type Exercise } from '@/data/exercises';
import { getMuscle } from '@/data/muscles';

export function ExercisePicker({ open, onOpenChange, onPick }: { open: boolean; onOpenChange: (o: boolean) => void; onPick: (e: Exercise) => void }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return EXERCISES;
    return EXERCISES.filter((e) => `${e.name} ${getMuscle(e.muscle)?.name ?? ''} ${e.equipment} ${e.difficulty}`.toLowerCase().includes(t));
  }, [q]);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setQ(''); onOpenChange(o); }}>
      <DialogContent className="flex max-h-[85dvh] max-w-lg flex-col gap-3 bg-[#f4f2e9] text-[#232a16]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-extrabold">Add an exercise</DialogTitle>
          <DialogDescription className="text-[#232a16]/70">Search the library by name, muscle or equipment. You can add the same exercise more than once.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#232a16]/60" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try squat, cable or glutes"
            aria-label="Search exercises"
            data-testid="input-picker-search"
            className="w-full rounded-full border border-[#232a16]/30 bg-white/60 py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <p className="text-xs text-[#232a16]/70" aria-live="polite" data-testid="text-picker-count">{results.length} exercise{results.length === 1 ? '' : 's'}</p>
        <ul className="-mx-1 flex-1 space-y-1 overflow-y-auto px-1">
          {results.map((e) => (
            <li key={e.slug}>
              <button
                type="button"
                onClick={() => onPick(e)}
                data-testid={`button-pick-${e.slug}`}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#ecf39e]"
              >
                <span>
                  <span className="block font-display font-bold">{e.name}</span>
                  <span className="block text-xs text-[#232a16]/70">{getMuscle(e.muscle)?.name} · {e.equipment} · {e.difficulty}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#232a16] px-3 py-1 text-xs font-semibold text-[#f4f2e9]"><Plus className="h-3 w-3" aria-hidden />Add</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="rounded-xl bg-[#232a16]/5 p-6 text-center text-sm">Nothing matches "{q}". Try a muscle name like chest or lats.</li>}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
