import { useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { Bot, MessageCircle, X } from 'lucide-react';
import { CoachChat } from '@/pages/coach';

export function CoachWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [location] = useLocation();
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };
  const toggle = () => {
    if (open) return close();
    setMounted(true);
    setOpen(true);
    requestAnimationFrame(() => panel.current?.focus());
  };

  // Keep the existing full-page URL as an alternative, without a second chat.
  if (location === '/coach') return null;

  return (
    <div className="fixed left-4 z-[45] flex flex-col items-start" style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
      {mounted && (
        <section
          ref={panel}
          id="floating-ai-coach"
          role="region"
          aria-label="AI coach chat"
          tabIndex={-1}
          onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } }}
          style={{ display: open ? 'flex' : 'none' }}
          className="mb-3 h-[min(640px,calc(100dvh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-[#232a16]/20 bg-[#f4f2e9] shadow-2xl outline-none sm:w-[400px]"
          data-testid="panel-ai-coach"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[#232a16]/10 bg-[#232a16] px-4 py-3 text-[#f4f2e9]">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#ecf39e]" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg font-bold">AI coach</h2>
                <p className="text-xs text-[#ecf39e]">Training questions & workout plans</p>
              </div>
            </div>
            <button type="button" onClick={close} aria-label="Close AI coach" className="rounded-full p-2 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ecf39e]" data-testid="button-close-coach">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <CoachChat embedded />
          </div>
        </section>
      )}
      <button
        ref={launcher}
        type="button"
        onClick={toggle}
        aria-label={open ? 'Close AI coach' : 'Open AI coach'}
        aria-expanded={open}
        aria-controls={mounted ? 'floating-ai-coach' : undefined}
        title="AI coach"
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#ecf39e] bg-[#232a16] text-[#ecf39e] shadow-xl transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#232a16] motion-reduce:transition-none"
        data-testid="button-ai-coach"
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
      </button>
    </div>
  );
}
