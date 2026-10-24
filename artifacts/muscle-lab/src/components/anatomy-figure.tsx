import { useId, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { useLocation } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { BACK, FRONT, MIRROR, REGION_RECTS, type View } from '@/data/anatomy-paths';
import frontImg from '@assets/eac9892c-2f81-4186-888a-63a9575c4cd9.jpg_1792839462087.jpeg';
import backImg from '@assets/ea3e7204-887f-4b7e-ae73-4565fa5206e3.jpg_1792839462088.jpeg';
import { getMuscle } from '@/data/muscles';

interface Props {
  view: View;
  interactive?: boolean;
  activeSlug?: string;
  activeRegion?: string;
  onRegionSelect?: (region: string) => void;
  className?: string;
}

export function AnatomyFigure({ view, interactive = true, activeSlug, activeRegion, onRegionSelect, className = '' }: Props) {
  const [, navigate] = useLocation();
  const wrap = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ slug: string; region?: string; x: number; y: number } | null>(null);
  const clipId = useId().replace(/:/g, '');
  const parts = view === 'front' ? FRONT : BACK;
  const activeMuscle = activeSlug ? getMuscle(activeSlug) : undefined;
  const activePart = parts.find((p) => p.slug === activeSlug);
  const regions = activeMuscle?.regions.filter((r) => {
    if (!REGION_RECTS[activeMuscle.slug]?.[r.id]) return false;
    if (activeMuscle.slug === 'shoulders') return view === 'back' ? r.id === 'rear' || r.id === 'side' : r.id !== 'rear';
    if (activeMuscle.slug === 'traps' && view === 'front') return r.id === 'upper';
    return true;
  }) ?? [];

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
  const tipRegion = tipMuscle?.regions.find((r) => r.id === tip?.region);

  return (
    <div ref={wrap} className={`relative ${className}`} onMouseLeave={() => setTip(null)}>
      <svg
        viewBox="0 0 468 1024"
        role="group"
        aria-label={`${view} view anatomy`}
        className={`w-full h-auto select-none ${activeRegion ? 'has-region' : ''}`}
      >
        <image href={view === 'front' ? frontImg : backImg} x="0" y="0" width="468" height="1024" />
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
              <g key={p.slug} {...common} pointerEvents="none" style={{ cursor: 'default' }}>
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
              onMouseLeave={() => setTip(null)}
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
        {activeSlug && activeRegion && !onRegionSelect && REGION_RECTS[activeSlug]?.[activeRegion] && (() => {
          const part = parts.find((p) => p.slug === activeSlug);
          if (!part) return null;
          const [x, y, w, h] = REGION_RECTS[activeSlug][activeRegion];
          const id = `clip-${clipId}-${view}-${activeSlug}`;
          return (
            <g className="region-highlight" aria-hidden="true" pointerEvents="none">
              <clipPath id={id}>{part.paths.map((d, i) => <path key={i} d={d} />)}</clipPath>
              {[undefined, MIRROR].map((t, i) => (
                <g key={i} transform={t}>
                  <g clipPath={`url(#${id})`}>
                    <rect x={x} y={y} width={w} height={h} />
                  </g>
                </g>
              ))}
            </g>
          );
        })()}
        {onRegionSelect && activeMuscle && activePart && (
          <>
            <defs>
              <clipPath id={`regions-${clipId}`}>
                {activePart.paths.map((d, i) => <path key={i} d={d} />)}
              </clipPath>
            </defs>
            {regions.map((r) => {
              const [x, y, width, height] = REGION_RECTS[activeMuscle.slug][r.id];
              // On the back view the rear delt occupies the visible shoulder cap.
              const bounds = activeMuscle.slug === 'shoulders' && r.id === 'rear'
                ? { x: 110, y: 190, width: 60, height: 110 }
                : { x, y, width, height };
              return (
                <g
                  key={r.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${r.name}. View submuscle details`}
                  aria-pressed={activeRegion === r.id}
                  className="region-hotspot"
                  data-active={activeRegion === r.id}
                  data-hovered={tip?.region === r.id}
                  data-testid={`region-${view}-${r.id}`}
                  onClick={() => onRegionSelect(r.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onRegionSelect(r.id);
                    }
                  }}
                  onMouseMove={(e) => {
                    const box = wrap.current?.getBoundingClientRect();
                    if (box) setTip({ slug: activeMuscle.slug, region: r.id, x: e.clientX - box.left, y: e.clientY - box.top });
                  }}
                  onMouseLeave={() => setTip(null)}
                  onFocus={(e) => {
                    const box = wrap.current?.getBoundingClientRect();
                    const target = e.currentTarget.getBoundingClientRect();
                    if (box) setTip({ slug: activeMuscle.slug, region: r.id, x: target.left + target.width / 2 - box.left, y: target.top - box.top });
                  }}
                  onBlur={() => setTip(null)}
                >
                  {[undefined, MIRROR].map((transform, i) => (
                    <g key={i} transform={transform}>
                      <g clipPath={`url(#regions-${clipId})`}>
                        <rect {...bounds} />
                      </g>
                    </g>
                  ))}
                </g>
              );
            })}
          </>
        )}
      </svg>
      {tip && tipMuscle && (interactive || onRegionSelect) && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-xl bg-[#232a16] px-3.5 py-2 text-[#f4f2e9] shadow-lg"
          style={{ left: tip.x, top: tip.y }}
          data-testid="tooltip-muscle"
        >
          <div className="font-display text-sm font-bold leading-tight">{tipRegion?.name ?? tipMuscle.name}</div>
          <div className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-[#ecf39e]">
            {tipRegion ? 'View submuscle details' : 'Go to muscle page'} <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      )}
    </div>
  );
}
