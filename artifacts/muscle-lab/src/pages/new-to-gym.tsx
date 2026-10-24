import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useMeta } from '@/hooks/use-meta';

const STEPS = [
  { t: 'Start with the map', d: 'Open the anatomy explorer and tap the muscles you want to understand. Knowing what you are working makes every rep purposeful.', link: '/', cta: 'Open explorer' },
  { t: 'Pick machines and dumbbells first', d: 'They guide the path of movement while you learn. Barbells can wait until the pattern feels natural.', link: '/exercises', cta: 'Browse exercises' },
  { t: 'Train each muscle about twice a week', d: 'Two or three sets of a few exercises per muscle, with a day or two between sessions, is plenty at the start.' },
  { t: 'Leave two reps in the tank', d: 'Finish each set feeling you could have done two more good reps. Form first, weight second.' },
  { t: 'Rest, eat, sleep', d: 'Muscle grows between sessions, not during them. Consistency across months beats any single workout.' },
];

const FAQ = [
  ['How long should a workout take?', 'Forty-five to sixty minutes is enough, including warm-up.'],
  ['How heavy should I lift?', 'Heavy enough that the last two reps are hard, light enough that your form never breaks.'],
  ['Will I get sore?', 'Probably, for the first couple of weeks. It fades quickly as you repeat the work.'],
];

export default function NewToGym() {
  useMeta('New to gym? | muscleLab', 'A plain-language beginner guide to your first weeks in the gym.');
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 md:px-8 md:pt-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#232a16]/70">Beginner guide</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] text-[#232a16] md:text-8xl">New to gym?<br />Good. Start here.</h1>
      <p className="mt-6 max-w-xl text-lg text-[#232a16]/85">Nobody is watching you as closely as you think. Here is the short version of how to begin.</p>

      <ol className="mt-12 space-y-4">
        {STEPS.map((s, i) => (
          <motion.li key={s.t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }} className="grid gap-4 rounded-3xl bg-[#f4f2e9] p-6 md:grid-cols-[96px_1fr] md:p-8">
            <span className="font-display text-6xl font-extrabold text-[#abc03c] [-webkit-text-stroke:2px_#232a16] md:text-7xl">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2 className="font-display text-2xl font-bold">{s.t}</h2>
              <p className="mt-2 max-w-2xl text-[#232a16]/80">{s.d}</p>
              {s.link && (
                <Link href={s.link} data-testid={`link-step-${i}`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#232a16] px-4 py-2 text-sm font-semibold text-[#f4f2e9] transition-transform hover:translate-x-1">
                  {s.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </motion.li>
        ))}
      </ol>

      <h2 className="mt-16 font-display text-3xl font-bold">Quick answers</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {FAQ.map(([q, a]) => (
          <div key={q} className="rounded-2xl border border-[#232a16]/25 p-5">
            <h3 className="font-display text-lg font-bold">{q}</h3>
            <p className="mt-2 text-sm text-[#232a16]/85">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
