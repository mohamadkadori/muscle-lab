import { useId, useState, type ReactNode } from 'react';
import { Box, ExternalLink, Layers2 } from 'lucide-react';

const MODEL_URL = 'https://sketchfab.com/models/e8239f94d87b4e278f0cf02dbad1a330';

/** The external model is only requested after the visitor opts into 3D. */
export function DiagramViewer({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  const [mode, setMode] = useState<'2d' | '3d'>('2d');
  const panelId = useId();

  return (
    <div className="min-w-0">
      <div role="group" aria-label="Diagram view" className="mb-5 flex gap-1 rounded-full bg-[#232a16]/10 p-1">
        {(['2d', '3d'] as const).map((option) => {
          const Icon = option === '2d' ? Layers2 : Box;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={mode === option}
              aria-controls={panelId}
              data-testid={`button-diagram-${option}`}
              onClick={() => setMode(option)}
              className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#232a16] ${
                mode === option ? 'bg-[#232a16] text-[#ecf39e] shadow-sm' : 'text-[#232a16] hover:bg-[#232a16]/10'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {option.toUpperCase()} diagram
            </button>
          );
        })}
      </div>
      <div id={panelId} role="region" aria-label={`${mode.toUpperCase()} anatomy diagram`}>
        {mode === '2d' ? children : (
          <div>
            <div className="overflow-hidden rounded-2xl border border-[#232a16]/15 bg-[#232a16]/5">
              <iframe
                title="Ecorche Anatomy Study — interactive 3D model"
                src={`${MODEL_URL}/embed`}
                allow="autoplay; fullscreen; xr-spatial-tracking; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className={`w-full border-0 ${compact ? 'h-[460px]' : 'h-[480px] md:h-[620px]'}`}
                data-testid="iframe-anatomy-3d"
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#232a16]/75">
              Drag to rotate, scroll or pinch to zoom. Use 2D for muscle highlights and exercise links.
            </p>
            <a href={MODEL_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#232a16] underline underline-offset-4">
              Open model on Sketchfab <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
