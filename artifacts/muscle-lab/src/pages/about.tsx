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
        <section className="rounded-2xl border border-[#232a16]/15 p-4 md:col-span-2 bg-card" aria-labelledby="movement-stats-title">
          <h2 id="movement-stats-title" className="font-display text-base font-semibold text-[#232a16]">
            Movement matters for everyone.
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#232a16]/80">
            Whether you study, work, or care for a family, making time to move matters.
            Developers are just one example of people whose daily routines can involve long stretches of sitting.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 sm:divide-x sm:divide-[#232a16]/15">
            <article className="sm:pr-3">
              <p className="text-[13px] leading-relaxed text-[#232a16]/80">
                <strong className="font-semibold text-[#232a16]">31%</strong> of adults worldwide did not meet activity recommendations in 2022—about 1.8 billion people.
              </p>
              <a
                href="https://www.who.int/news/item/26-06-2024-nearly-1-8-billion-adults-at-risk-of-disease-from-not-doing-enough-physical-activity"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-xs text-[#232a16]/80 underline underline-offset-2 hover:text-[#232a16]"
              >
                WHO · 2024
              </a>
            </article>
            <article className="sm:pl-3">
              <p className="text-[13px] leading-relaxed text-[#232a16]/80">
                <strong className="font-semibold text-[#232a16]">150 min</strong> of moderate-intensity physical activity per week is the minimum WHO recommends for adults.
              </p>
              <a
                href="https://www.who.int/news-room/fact-sheets/detail/physical-activity"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-xs text-[#232a16]/80 underline underline-offset-2 hover:text-[#232a16]"
              >
                WHO · Adult activity guidance
              </a>
            </article>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#232a16]/65">
            Population-level data and general activity guidance for adults. Not a personal health assessment.
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
