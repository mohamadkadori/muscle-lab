import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { useLocation } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import {
  BACK,
  BACK_LINES,
  BODY_BASE,
  FRONT,
  FRONT_LINES,
  HEAD,
  MIRROR,
  REGION_HIGHLIGHTS,
  type View,
} from '@/data/anatomy-paths';
import { getMuscle } from '@/data/muscles';

interface Props {
  view: View;
  interactive?: boolean;
  activeSlug?: string;
  activeRegion?: string;
  className?: string;
}

export function AnatomyFigure({ view, interactive = true, activeSlug, activeRegion, className = '' }: Props) {
  const [, navigate] = useLocation();
  const wrap = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ slug: string; x: number; y: number } | null>(null);
  const parts = view === 'front' ? FRONT : BACK;
  const lines = view === 'front' ? FRONT_LINES : BACK_LINES;

  const place = (slug: string, cx: number, cy: number) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    setTip({ slug, x: cx - r.left, y: cy - r.top });
  };
  const onMove = (slug: string) => (e: MouseEvent) => place(slug, e.clientX, e.clientY);
  const onFocus = (slug: string) => (e: React.FocusEvent<SVGGElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    place(slug, b.left + b.width / 2, b.top + b.height / 2);
  };
  const go = (slug: string) => navigate(`/muscles/${slug}`);
  const onKey = (slug: string) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      go(slug);
    }
  };

  const tipMuscle = tip ? getMuscle(tip.slug) : null;

  return (
    <div ref={wrap} className={`relative ${className}`} onMouseLeave={() => setTip(null)}>
      <svg
        viewBox="0 0 400 810"
        role="group"
        aria-label={`${view} view anatomy`}
        className={`w-full h-auto select-none ${activeSlug ? 'fig-dim' : ''}`}
      >
        <g fill="#bdbbb1" stroke="#bdbbb1" strokeWidth="1" strokeLinejoin="round">
          <path d={HEAD} />
          <path d={BODY_BASE} />
          <path d={BODY_BASE} transform={MIRROR} />
          <path d={HEAD} transform={MIRROR} />
        </g>
        {/* neck */}
        <rect x="184" y="108" width="32" height="34" fill="#bdbbb1" />
        {parts.map((p) => {
          const m = getMuscle(p.slug);
          const label = m?.name ?? p.slug;
          const active = activeSlug === p.slug;
          const common = {
            className: 'muscle',
            'data-active': active,
            'data-testid': `muscle-${view}-${p.slug}`,
          };
          if (!interactive) {
            return (
              <g key={p.slug} {...common} style={{ cursor: 'default' }}>
                {p.paths.map((d, i) => (
                  <g key={i}>
                    <path className="m" d={d} />
                    <path className="m" d={d} transform={MIRROR} />
                  </g>
                ))}
              </g>
            );
          }
          return (
            <g
              key={p.slug}
              {...common}
              role="link"
              tabIndex={0}
              aria-label={`${label}. Go to muscle page`}
              onClick={() => go(p.slug)}
              onKeyDown={onKey(p.slug)}
              onMouseEnter={onMove(p.slug)}
              onMouseMove={onMove(p.slug)}
              onFocus={onFocus(p.slug)}
              onBlur={() => setTip(null)}
            >
              {p.paths.map((d, i) => (
                <g key={i}>
                  <path className="m" d={d} />
                  <path className="m" d={d} transform={MIRROR} />
                </g>
              ))}
            </g>
          );
        })}
        {activeSlug && activeRegion && REGION_HIGHLIGHTS[activeSlug]?.[activeRegion] && (
          <g className="region-highlight" aria-hidden="true">
            {REGION_HIGHLIGHTS[activeSlug][activeRegion].map((d, i) => (
              <g key={i}>
                <path d={d} />
                <path d={d} transform={MIRROR} />
              </g>
            ))}
          </g>
        )}
        <g fill="none" stroke="#f4f2e9" strokeWidth="1.4" strokeLinecap="round" pointerEvents="none" opacity="0.9">
          {lines.map((d, i) => (
            <g key={i}>
              <path d={d} />
              <path d={d} transform={MIRROR} />
            </g>
          ))}
        </g>
        {/* face hint / spine hint */}
        <g fill="none" stroke="#f4f2e9" strokeWidth="1.2" opacity="0.7" pointerEvents="none">
          {view === 'front' ? (
            <path d="M188 80 Q200 90 212 80" />
          ) : (
            <path d="M200 100 L200 126" />
          )}
        </g>
      </svg>
      {tip && tipMuscle && interactive && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-xl bg-[#232a16] px-3.5 py-2 text-[#f4f2e9] shadow-lg"
          style={{ left: tip.x, top: tip.y }}
          data-testid="tooltip-muscle"
        >
          <div className="font-display text-sm font-bold leading-tight">{tipMuscle.name}</div>
          <div className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-[#ecf39e]">
            Go to muscle page <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      )}
    </div>
  );
}
