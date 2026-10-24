import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { guardNav } from '@/lib/unsaved-guard';

const NAV = [
  { href: '/exercises', label: 'All exercises', id: 'exercises' },
  { href: '/new-to-gym', label: 'New to gym?', id: 'new' },
  { href: '/workouts', label: 'My workouts', id: 'workouts' },
  { href: '/about', label: 'About us', id: 'about' },
  { href: '/', label: 'Anatomy explorer', id: 'explorer' },
];

export function Logo() {
  return (
    <span className="font-display text-2xl font-extrabold tracking-tight text-[#232a16]">
      muscle<span className="rounded-md bg-[#232a16] px-1.5 pb-0.5 ml-0.5 text-[#ecf39e]">Lab</span>
    </span>
  );
}

export function SiteHeader() {
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === '/' ? loc === '/' || loc.startsWith('/muscles') : loc.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-[#232a16]/10 bg-[#f4f2e9]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="rounded-lg" data-testid="link-brand" onClick={(e) => { if (guardNav(e, '/')) return; setOpen(false); }}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.id}
              href={n.href}
              onClick={(e) => guardNav(e, n.href)}
              data-testid={`link-nav-${n.id}`}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive(n.href) ? 'text-[#f4f2e9]' : 'text-[#232a16] hover:bg-[#232a16]/10'
              }`}
            >
              {isActive(n.href) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-[#232a16]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{n.label}</span>
            </Link>
          ))}
        </nav>
        <button
          className="rounded-full p-2 text-[#232a16] lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          data-testid="button-menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#232a16]/15 lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 bg-[#f4f2e9] p-4">
              {NAV.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={(e) => { if (guardNav(e, n.href)) return; setOpen(false); }}
                  data-testid={`link-mobile-${n.id}`}
                  className={`rounded-xl px-4 py-3 font-display text-lg font-bold ${
                    isActive(n.href) ? 'bg-[#232a16] text-[#f4f2e9]' : 'text-[#232a16]'
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-[#232a16] text-[#f4f2e9]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <div className="font-display text-2xl font-extrabold">
            muscle<span className="text-[#ecf39e]">Lab</span>
          </div>
          <p className="mt-1 max-w-sm text-sm text-[#f4f2e9]/60">
            A visual field guide to the muscles you train. Exercise content is sample data.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {NAV.map((n) => (
            <Link key={n.id} href={n.href} onClick={(e) => guardNav(e, n.href)} className="text-[#f4f2e9]/80 hover:text-[#ecf39e]" data-testid={`link-footer-${n.id}`}>
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
