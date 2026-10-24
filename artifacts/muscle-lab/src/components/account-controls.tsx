import { Link } from 'wouter';
import { Show, useUser } from '@clerk/react';
import { LogOut } from 'lucide-react';
import { guardNav } from '@/lib/unsaved-guard';

function useIdentity() {
  const { user } = useUser();
  const label = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || 'Account';
  const initials = label.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((s) => s[0]!.toUpperCase()).join('') || 'U';
  return { label, initials };
}

export function DesktopAccount() {
  const { label, initials } = useIdentity();
  return (
    <div className="hidden shrink-0 items-center gap-2 xl:flex">
      <Show when="signed-out">
        <Link href="/sign-in" onClick={(e) => guardNav(e, '/sign-in')} data-testid="link-sign-in" className="rounded-full px-3 py-2 text-sm font-semibold text-[#232a16] hover:bg-[#232a16]/10">Sign in</Link>
        <Link href="/sign-up" onClick={(e) => guardNav(e, '/sign-up')} data-testid="link-sign-up" className="rounded-full bg-[#232a16] px-4 py-2 text-sm font-semibold text-[#ecf39e]">Create account</Link>
      </Show>
      <Show when="signed-in">
        <span title={label} data-testid="text-account" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ecf39e] font-display text-sm font-bold text-[#232a16] ring-2 ring-[#232a16]">{initials}</span>
        <Link href="/sign-out" onClick={(e) => guardNav(e, '/sign-out')} data-testid="link-sign-out" aria-label="Sign out" title="Sign out" className="rounded-full p-2 text-[#232a16] hover:bg-[#232a16]/10">
          <LogOut className="h-4 w-4" />
        </Link>
      </Show>
    </div>
  );
}

export function MobileAccount({ onNavigate }: { onNavigate: () => void }) {
  const { label, initials } = useIdentity();
  return (
    <div className="mt-2 border-t border-[#232a16]/15 pt-3">
      <Show when="signed-out">
        <div className="grid grid-cols-2 gap-2">
          <Link href="/sign-in" onClick={(e) => { if (!guardNav(e, '/sign-in')) onNavigate(); }} data-testid="link-mobile-sign-in" className="rounded-xl border border-[#232a16] px-4 py-3 text-center font-display font-bold text-[#232a16]">Sign in</Link>
          <Link href="/sign-up" onClick={(e) => { if (!guardNav(e, '/sign-up')) onNavigate(); }} data-testid="link-mobile-sign-up" className="rounded-xl bg-[#232a16] px-4 py-3 text-center font-display font-bold text-[#ecf39e]">Create account</Link>
        </div>
      </Show>
      <Show when="signed-in">
        <div className="flex items-center gap-3 px-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ecf39e] font-display font-bold text-[#232a16] ring-2 ring-[#232a16]">{initials}</span>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#232a16]" data-testid="text-mobile-account">{label}</span>
          <Link
            href="/sign-out"
            onClick={(e) => { if (guardNav(e, '/sign-out')) return; onNavigate(); }}
            data-testid="link-mobile-sign-out"
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#232a16] px-3 py-2 text-sm font-bold text-[#ecf39e]"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </div>
      </Show>
    </div>
  );
}
