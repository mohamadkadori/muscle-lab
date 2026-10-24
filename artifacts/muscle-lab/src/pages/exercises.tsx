import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { ExerciseCard } from '@/components/exercise-card';
import { DIFFICULTIES, EQUIPMENT, EXERCISES } from '@/data/exercises';
import { MUSCLES } from '@/data/muscles';
import { useMeta } from '@/hooks/use-meta';

function Chip({ active, onClick, children, id }: { active: boolean; onClick: () => void; children: string; id: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      data-testid={id}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        active ? 'border-[#232a16] bg-[#232a16] text-[#f4f2e9]' : 'border-[#232a16]/40 text-[#232a16] hover:bg-[#232a16]/10'
      }`}
    >
      {children}
    </button>
  );
}

export default function Exercises() {
  useMeta('All exercises | muscleLab', 'Search and filter the muscleLab sample exercise library by muscle, equipment and difficulty.');
  const [q, setQ] = useState('');
  const [muscle, setMuscle] = useState('');
  const [equip, setEquip] = useState('');
  const [diff, setDiff] = useState('');

  const list = useMemo(
    () =>
      EXERCISES.filter(
        (e) =>
          (!muscle || e.muscle === muscle) &&
          (!equip || e.equipment === equip) &&
          (!diff || e.difficulty === diff) &&
          (!q || e.name.toLowerCase().includes(q.toLowerCase()) || e.muscle.includes(q.toLowerCase())),
      ),
    [q, muscle, equip, diff],
  );
  const dirty = q || muscle || equip || diff;
  const reset = () => {
    setQ('');
    setMuscle('');
    setEquip('');
    setDiff('');
  };
  const toggle = (cur: string, v: string, set: (s: string) => void) => set(cur === v ? '' : v);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#232a16]/70">Library / sample data</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold text-[#232a16] md:text-7xl">All exercises</h1>
      <p className="mt-4 max-w-xl text-lg text-[#232a16]/80">
        {EXERCISES.length} demo exercises across {MUSCLES.length} muscle groups. Real content is on its way.
      </p>

      <div className="mt-8 rounded-3xl bg-[#f4f2e9] p-5 shadow-lg md:p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#232a16]/50" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search exercises or muscles"
            aria-label="Search exercises"
            data-testid="input-search"
            className="w-full rounded-2xl border border-[#232a16]/20 bg-white/60 py-3.5 pl-12 pr-4 text-base outline-none focus:border-[#232a16]"
          />
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[#232a16]/60">Muscle</div>
            <div className="flex flex-wrap gap-2">
              {MUSCLES.map((m) => (
                <Chip key={m.slug} id={`filter-muscle-${m.slug}`} active={muscle === m.slug} onClick={() => toggle(muscle, m.slug, setMuscle)}>
                  {m.name}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[#232a16]/60">Equipment</div>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT.map((e) => (
                  <Chip key={e} id={`filter-equipment-${e}`} active={equip === e} onClick={() => toggle(equip, e, setEquip)}>
                    {e}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[#232a16]/60">Difficulty</div>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map((d) => (
                  <Chip key={d} id={`filter-difficulty-${d}`} active={diff === d} onClick={() => toggle(diff, d, setDiff)}>
                    {d}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-mono text-sm text-[#232a16]" data-testid="text-result-count">
          {list.length} result{list.length === 1 ? '' : 's'}
        </span>
        {dirty && (
          <button onClick={reset} data-testid="button-reset" className="inline-flex items-center gap-1 text-sm font-semibold underline">
            <X className="h-4 w-4" /> Clear filters
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((e, i) => (
            <ExerciseCard key={e.slug} exercise={e} index={i} />
          ))}
        </AnimatePresence>
      </div>
      {list.length === 0 && (
        <div className="mt-4 rounded-3xl bg-[#f4f2e9] p-10 text-center">
          <p className="font-display text-2xl font-bold">Nothing matches that combination.</p>
          <button onClick={reset} className="mt-4 rounded-full bg-[#232a16] px-5 py-2.5 text-sm font-semibold text-[#f4f2e9]" data-testid="button-reset-empty">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
