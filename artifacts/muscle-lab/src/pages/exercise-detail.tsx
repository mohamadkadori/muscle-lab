import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Dumbbell, Info, Target } from 'lucide-react';
import { AnatomyFigure } from '@/components/anatomy-figure';
import { DiagramViewer } from '@/components/diagram-viewer';
import { Difficulty, ExerciseCard } from '@/components/exercise-card';
import { EXERCISES, getExercise } from '@/data/exercises';
import { getMuscle } from '@/data/muscles';
import { useMeta } from '@/hooks/use-meta';
import NotFound from '@/pages/not-found';

export default function ExerciseDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const ex = getExercise(slug);
  useMeta(ex ? `${ex.name} | muscleLab` : 'Exercise not found | muscleLab', ex ? ex.description : 'Exercise not found.');
  if (!ex) return <NotFound />;
  const muscle = getMuscle(ex.muscle)!;
  const regions = muscle.regions.filter((r) => ex.regions.includes(r.id));
  const view = muscle.views[0];
  const related = EXERCISES.filter((e) => e.muscle === ex.muscle && e.slug !== ex.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-8 md:px-8 md:pt-12">
      <Link href="/exercises" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" data-testid="link-back-exercises">
        <ArrowLeft className="h-4 w-4" /> All exercises
      </Link>
      <div className="mt-4 inline-block rounded-full bg-[#232a16] px-3 py-1 font-mono text-[11px] uppercase text-[#ecf39e]">
        Sample exercise / demo content
      </div>
      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-extrabold text-[#232a16] md:text-7xl" data-testid="text-exercise-name">
            {ex.name}
          </motion.h1>
          <p className="mt-4 max-w-2xl text-xl text-[#232a16]/85">{ex.description}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f4f2e9] p-4">
              <Target className="h-5 w-5" />
              <div className="mt-3 font-mono text-[11px] uppercase text-[#232a16]/60">Target</div>
              <Link href={`/muscles/${muscle.slug}`} className="font-display text-lg font-bold underline decoration-[#ecf39e] decoration-2 underline-offset-4" data-testid="link-target-muscle">
                {muscle.name}
              </Link>
              <div className="text-sm text-[#232a16]/70">{regions.map((r) => r.name).join(', ')}</div>
            </div>
            <div className="rounded-2xl bg-[#f4f2e9] p-4">
              <Dumbbell className="h-5 w-5" />
              <div className="mt-3 font-mono text-[11px] uppercase text-[#232a16]/60">Equipment</div>
              <div className="font-display text-lg font-bold" data-testid="text-equipment">{ex.equipment}</div>
            </div>
            <div className="rounded-2xl bg-[#f4f2e9] p-4">
              <Info className="h-5 w-5" />
              <div className="mt-3 font-mono text-[11px] uppercase text-[#232a16]/60">Difficulty</div>
              <div className="mt-1"><Difficulty level={ex.difficulty} /></div>
            </div>
          </div>

          <h2 className="mt-12 font-display text-2xl font-bold">How to do it</h2>
          <ol className="mt-4 space-y-3">
            {ex.instructions.map((s, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }} className="flex gap-4 rounded-2xl bg-[#f4f2e9] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#232a16] font-display font-bold text-[#ecf39e]">{i + 1}</span>
                <p className="pt-1">{s}</p>
              </motion.li>
            ))}
          </ol>

          <div className="mt-8 rounded-2xl bg-[#232a16] p-6 text-[#f4f2e9]">
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#ecf39e]">Coaching cues</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {ex.tips.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>

          <h2 className="mt-12 font-display text-2xl font-bold">Muscles worked</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[ex.muscle, ...ex.secondary].map((s, i) => {
              const m = getMuscle(s);
              if (!m) return null;
              return (
                <Link key={s} href={`/muscles/${s}`} data-testid={`link-worked-${s}`} className="rounded-2xl border border-[#232a16]/15 bg-[#f4f2e9] p-4 transition-transform hover:-translate-y-0.5">
                  <div className="font-mono text-[11px] uppercase text-[#232a16]/60">{i === 0 ? 'Primary' : 'Secondary'}</div>
                  <div className="font-display text-lg font-bold">{m.name}</div>
                  <p className="text-sm text-[#232a16]/75">{m.summary}</p>
                </Link>
              );
            })}
          </div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] bg-[#f4f2e9] p-6 shadow-xl">
            <DiagramViewer key={ex.slug} compact>
            <AnatomyFigure view={view} interactive={false} activeSlug={ex.muscle} className="mx-auto max-w-[220px]" />
            </DiagramViewer>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold">More for {muscle.name.toLowerCase()}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((e, i) => <ExerciseCard key={e.slug} exercise={e} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
