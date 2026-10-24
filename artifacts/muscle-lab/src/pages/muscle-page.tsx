import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { AnatomyFigure } from '@/components/anatomy-figure';
import { ExerciseCard } from '@/components/exercise-card';
import { getMuscle } from '@/data/muscles';
import { EXERCISES } from '@/data/exercises';
import { REGION_DETAILS } from '@/data/region-details';
import { useMeta } from '@/hooks/use-meta';
import NotFound from '@/pages/not-found';

export default function MusclePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const muscle = getMuscle(slug);
  const [region, setRegion] = useState<string>('all');
  const [view, setView] = useState<'front' | 'back'>('front');
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRegion('all');
    if (muscle) setView(muscle.views[0]);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (region !== 'all' && window.matchMedia('(max-width: 1023px)').matches) {
      detailRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }, [region]);

  useMeta(
    muscle ? `${muscle.name} | muscleLab` : 'Muscle not found | muscleLab',
    muscle ? `${muscle.summary} ${muscle.job}` : 'Muscle not found.',
  );

  if (!muscle) return <NotFound />;

  const all = EXERCISES.filter((e) => e.muscle === muscle.slug);
  const list = region === 'all' ? all : all.filter((e) => e.regions.includes(region));
  const activeRegion = muscle.regions.find((r) => r.id === region);
  const detail = REGION_DETAILS[`${muscle.slug}/${region}`];
  const chooseRegion = (id: string) => {
    setRegion(id);
    if (muscle.views.length > 1) {
      if (muscle.slug === 'shoulders') setView(id === 'rear' ? 'back' : 'front');
      if (muscle.slug === 'traps') setView(id === 'upper' || id === 'all' ? muscle.views[0] : 'back');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pt-2 md:px-8 md:pt-4">
      <div className="flex h-11 items-center rounded-xl bg-[#171812] px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#f4f2e9] transition-colors hover:text-[#ecf39e]" data-testid="link-back-explorer">
          <ArrowLeft className="h-4 w-4" /> Anatomy explorer
        </Link>
      </div>
      <div className="mt-3 grid gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
        <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] bg-[#f4f2e9] p-6 shadow-xl">
            <p className="mb-3 text-center text-xs text-[#232a16]/75">Hover a region to explore. Click or tap for details.</p>
            <AnatomyFigure key={`${muscle.slug}-${view}`} view={view} interactive={false} activeSlug={muscle.slug} activeRegion={region === 'all' ? undefined : region} onRegionSelect={chooseRegion} className="mx-auto max-w-[240px]" />
            {activeRegion && (
              <p className="mt-4 rounded-xl bg-[#ecf39e] px-4 py-2 text-center font-mono text-xs uppercase tracking-wide text-[#232a16]">
                Highlighted: {activeRegion.name}
              </p>
            )}
            {muscle.views.length > 1 && (
              <div className="mt-3 flex justify-center gap-1 rounded-full bg-[#232a16]/10 p-1">
                {muscle.views.map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    data-testid={`button-view-${v}`}
                    aria-pressed={view === v}
                    className={`flex-1 rounded-full px-4 py-1.5 font-mono text-xs uppercase transition-colors ${
                      view === v ? 'bg-[#232a16] text-[#ecf39e]' : 'text-[#232a16]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.aside>

        <div>
          <motion.div key={muscle.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#232a16]/70">Muscle / {muscle.views.join(' + ')}</p>
            <h1 className="mt-2 font-display text-6xl font-extrabold text-[#232a16] md:text-8xl" data-testid="text-muscle-name">
              {muscle.name}
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-[#232a16]/85">{muscle.summary}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[#f4f2e9] p-5">
                <h2 className="font-mono text-xs uppercase tracking-widest text-[#232a16]/60">What it does</h2>
                <p className="mt-2">{muscle.job}</p>
              </div>
              <div className="rounded-2xl bg-[#232a16] p-5 text-[#f4f2e9]">
                <h2 className="font-mono text-xs uppercase tracking-widest text-[#ecf39e]">Beginner tip</h2>
                <p className="mt-2">{muscle.beginnerTip}</p>
              </div>
            </div>
          </motion.div>

          <section className="mt-12" aria-labelledby="regions-h">
            <h2 id="regions-h" className="font-display text-2xl font-bold text-[#232a16]">
              Choose a training region
            </h2>
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Training regions">
              {[{ id: 'all', name: `All ${muscle.name.toLowerCase()}` }, ...muscle.regions].map((r) => (
                <button
                  key={r.id}
                  onClick={() => chooseRegion(r.id)}
                  aria-pressed={region === r.id}
                  data-testid={`button-region-${r.id}`}
                  className={`relative rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
                    region === r.id
                      ? 'border-[#232a16] bg-[#232a16] text-[#f4f2e9]'
                      : 'border-[#232a16]/40 text-[#232a16] hover:border-[#232a16] hover:bg-[#232a16]/10'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={region}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 max-w-2xl text-[#232a16]/85"
                data-testid="text-region-description"
              >
                {activeRegion ? activeRegion.description : `All exercises that train the ${muscle.name.toLowerCase()}. Pick a region to narrow the list.`}
              </motion.p>
            </AnimatePresence>
            <div ref={detailRef} className="scroll-mt-24" aria-live="polite">
              {activeRegion && (
                <section className="mt-6 rounded-3xl bg-[#f4f2e9] p-6" aria-labelledby="region-detail-heading" data-testid="region-detail">
                  <p className="font-mono text-xs uppercase tracking-widest text-[#232a16]/60">Training region / {muscle.name}</p>
                  <h3 id="region-detail-heading" className="mt-2 font-display text-3xl font-bold">{activeRegion.name}</h3>
                  <p className="mt-3 text-[#232a16]/85">{detail?.anatomy ?? `${activeRegion.description} ${muscle.job}`}</p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <h4 className="font-semibold">How to train it</h4>
                      <p className="mt-2 text-sm leading-relaxed text-[#232a16]/80">
                        {detail?.training ?? (list.length
                          ? `Explore ${list.slice(0, 2).map((e) => e.name).join(' and ')} in the sample exercises below. Choose a variation you can perform with control, then increase the challenge gradually.`
                          : 'Start with controlled movements for this muscle group. Exercises for this region will be added to the library.')}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">What to focus on</h4>
                      <p className="mt-2 text-sm leading-relaxed text-[#232a16]/80">{detail?.cue ?? muscle.beginnerTip}</p>
                    </div>
                  </div>
                  <button onClick={() => chooseRegion('all')} className="mt-5 text-sm font-semibold underline underline-offset-4" data-testid="button-clear-region">
                    Show the whole {muscle.name.toLowerCase()} again
                  </button>
                </section>
              )}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="ex-h">
            <div className="flex items-baseline justify-between">
              <h2 id="ex-h" className="font-display text-2xl font-bold text-[#232a16]">
                Exercises
              </h2>
              <span className="font-mono text-xs text-[#232a16]/70" data-testid="text-exercise-count">
                {list.length} sample {list.length === 1 ? 'exercise' : 'exercises'}
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {list.map((e, i) => (
                  <ExerciseCard key={e.slug} exercise={e} index={i} />
                ))}
              </AnimatePresence>
            </div>
            {list.length === 0 && (
              <p className="mt-4 rounded-2xl bg-[#f4f2e9] p-6">No exercises for this region yet. Real exercises will be added later.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
