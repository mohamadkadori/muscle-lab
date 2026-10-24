import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useMeta } from '@/hooks/use-meta';

export default function About() {
  useMeta('About us | muscleLab', 'muscleLab is a visual field guide that helps gym beginners understand exactly which muscles they train.');
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 md:px-8 md:pt-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#232a16]/70">About us</p>
      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-display text-5xl font-extrabold leading-[0.95] text-[#232a16] md:text-8xl">
        A map for the body you are building.
      </motion.h1>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-[#f4f2e9] p-8">
          <h2 className="font-display text-2xl font-bold">Why muscleLab exists</h2>
          <p className="mt-3 text-[#232a16]/85">Gym instructions often assume you already know where the lats are. We believe beginners train better when they can see what they are working, so we built the body first and the exercises second.</p>
        </div>
        <div className="rounded-3xl bg-[#232a16] p-8 text-[#f4f2e9]">
          <h2 className="font-display text-2xl font-bold text-[#ecf39e]">How it works</h2>
          <p className="mt-3 text-[#f4f2e9]/85">Choose a muscle on the anatomy map, learn its job, pick a training region, and see the exercises that fit. Clear guidance, without the clutter.</p>
        </div>
        <section className="mt-6 rounded-3xl bg-[#ecf39e] p-8 md:col-span-2 md:p-10" aria-labelledby="movement-stats-title">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#232a16]/65">A desk-work reality check</p>
          <h2 id="movement-stats-title" className="mt-3 max-w-2xl font-display text-3xl font-extrabold text-[#232a16] md:text-5xl">
            Long hours at a screen can keep us still.
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-[#232a16]/80">
            People building software often spend much of the day at a desk. These studies did not measure software developers specifically, but research on adults and office workers shows why making room for movement matters.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl bg-[#f4f2e9] p-6 md:p-7">
              <p className="font-display text-5xl font-extrabold tracking-tight text-[#232a16] md:text-6xl">31%</p>
              <p className="mt-3 font-display text-lg font-bold text-[#232a16]">of adults worldwide weren’t active enough</p>
              <p className="mt-2 text-sm leading-relaxed text-[#232a16]/75">
                An estimated 1.8 billion adults did not meet recommended activity levels in 2022.
              </p>
              <a
                href="https://www.who.int/news/item/26-06-2024-nearly-1-8-billion-adults-at-risk-of-disease-from-not-doing-enough-physical-activity"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-[#232a16] underline decoration-[#90a955] decoration-2 underline-offset-4"
              >
                Source: World Health Organization, 2024
              </a>
            </article>
            <article className="rounded-2xl bg-[#232a16] p-6 text-[#f4f2e9] md:p-7">
              <p className="font-display text-5xl font-extrabold tracking-tight text-[#ecf39e] md:text-6xl">+2.3 hrs</p>
              <p className="mt-3 font-display text-lg font-bold">more sedentary time per day for office workers</p>
              <p className="mt-2 text-sm leading-relaxed text-[#f4f2e9]/75">
                A review of activity-tracking studies found office workers had 2.3 more sedentary hours and 14 fewer minutes of moderate-to-vigorous activity per day than nurses in occupational comparisons.
              </p>
              <a
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11302194/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-[#ecf39e] underline decoration-[#90a955] decoration-2 underline-offset-4"
              >
                Source: Park et al., BMC Public Health, 2024
              </a>
            </article>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[#232a16]/65">
            These are population-level findings, not a measurement of software developers or a personal health assessment.
          </p>
        </section>
        <div className="rounded-3xl border border-[#232a16]/30 p-8 md:col-span-2">
          <h2 className="font-display text-2xl font-bold">A note on the content</h2>
          <p className="mt-3 max-w-2xl text-[#232a16]/85">The exercises you see today are demo entries used to shape the experience. A verified exercise library will replace them. muscleLab is educational and not medical advice; talk to a professional if you have an injury.</p>
          <Link href="/explorer" className="mt-6 inline-block rounded-full bg-[#232a16] px-5 py-2.5 text-sm font-semibold text-[#f4f2e9]" data-testid="link-about-explorer">
            Try the explorer
          </Link>
        </div>
      </div>
    </div>
  );
}
