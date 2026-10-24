import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';
import { AnatomyFigure } from '@/components/anatomy-figure';
import { MUSCLES } from '@/data/muscles';
import { useMeta } from '@/hooks/use-meta';

export default function Explorer() {
  useMeta('muscleLab | Anatomy explorer', 'An interactive front and back anatomy map for gym beginners. Tap any muscle to learn what it does and how to train it.');
  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:pt-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#232a16]/70">Visual field guide</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] text-[#232a16] md:text-7xl">
            Know exactly what you train.
          </h1>
          <p className="mt-6 max-w-md text-lg text-[#232a16]/80">
            Every muscle on the body map is a door. Point at one, tap it, and learn its job, its parts and the exercises that work it.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#232a16] px-4 py-2 text-sm text-[#f4f2e9]">
            <MousePointerClick className="h-4 w-4 text-[#abc03c]" />
            Hover or tab to a muscle, click to open it
          </div>
          <div className="mt-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#232a16]/70">Or pick from the list</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {MUSCLES.map((m) => (
                <Link
                  key={m.slug}
                  href={`/muscles/${m.slug}`}
                  data-testid={`link-muscle-chip-${m.slug}`}
                  className="rounded-full border border-[#232a16]/30 px-3.5 py-1.5 text-sm font-semibold text-[#232a16] transition-colors hover:bg-[#232a16] hover:text-[#abc03c]"
                >
                  {m.name}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative rounded-[2rem] bg-[#f4f2e9] p-4 shadow-xl md:p-8"
        >
          <div className="grid grid-cols-2 gap-2 md:gap-6">
            {(['front', 'back'] as const).map((v) => (
              <div key={v}>
                <AnatomyFigure view={v} />
                <p className="mt-1 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-[#232a16]/50">{v}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative mt-20 overflow-hidden border-y border-[#232a16]/20 py-4" aria-hidden>
        <div className="marquee flex w-max gap-10 font-display text-3xl font-extrabold uppercase text-[#232a16]/80">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-10">
              {MUSCLES.map((m) => (
                <span key={m.slug}>{m.name} /</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
