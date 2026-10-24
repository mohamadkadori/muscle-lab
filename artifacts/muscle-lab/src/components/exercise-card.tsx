import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Exercise } from '@/data/exercises';
import { getMuscle } from '@/data/muscles';

const DOTS: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };

export function Difficulty({ level }: { level: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-[#232a16]/70">
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span key={i} className={`h-1.5 w-3 rounded-full ${i <= DOTS[level] ? 'bg-[#232a16]' : 'bg-[#232a16]/15'}`} />
        ))}
      </span>
      {level}
    </span>
  );
}

export function ExerciseCard({ exercise, index = 0 }: { exercise: Exercise; index?: number }) {
  const muscle = getMuscle(exercise.muscle);
  const regionNames = exercise.regions
    .map((r) => muscle?.regions.find((x) => x.id === r)?.name)
    .filter(Boolean)
    .join(' / ');
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.35 }}
    >
      <Link
        href={`/exercises/${exercise.slug}`}
        data-testid={`card-exercise-${exercise.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-[#232a16]/10 bg-[#f4f2e9] p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-[#abc03c] px-2.5 py-1 font-mono text-[11px] font-medium uppercase text-[#232a16]">
            {muscle?.name}
          </span>
          <ArrowUpRight className="h-5 w-5 text-[#232a16]/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#232a16]" />
        </div>
        <h3 className="mt-5 font-display text-xl font-bold leading-tight">{exercise.name}</h3>
        <p className="mt-1 text-sm text-[#232a16]/60">{regionNames}</p>
        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="font-mono text-xs text-[#232a16]/70">{exercise.equipment}</span>
          <Difficulty level={exercise.difficulty} />
        </div>
      </Link>
    </motion.div>
  );
}
