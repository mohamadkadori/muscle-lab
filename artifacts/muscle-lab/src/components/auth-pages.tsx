import { useEffect, useRef, useState } from 'react';
import { SignIn, SignUp, useClerk } from '@clerk/react';

export const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function AuthShell({ title, blurb, children }: { title: string; blurb: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-[1fr_auto] md:px-8">
      <div className="max-w-md">
        <p className="font-mono text-xs uppercase tracking-widest text-[#232a16]/70">Your private log</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] text-[#232a16] md:text-6xl">{title}</h1>
        <p className="mt-4 text-base text-[#232a16]/80">{blurb}</p>
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

export function SignInPage() {
  return (
    <AuthShell title="Pick up where you left off." blurb="Sign in to open your saved workouts on any device.">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} fallbackRedirectUrl={`${basePath}/workouts`} forceRedirectUrl={`${basePath}/workouts`} />
    </AuthShell>
  );
}

export function SignUpPage() {
  return (
    <AuthShell title="Save a workout once. Use it anywhere." blurb="Create a free account to keep your routines private and synced.">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} fallbackRedirectUrl={`${basePath}/workouts`} forceRedirectUrl={`${basePath}/workouts`} />
    </AuthShell>
  );
}

export function SignOutPage() {
  const { signOut } = useClerk();
  const done = useRef(false);
  const [error, setError] = useState(false);
  const perform = () => {
    setError(false);
    void signOut({ redirectUrl: basePath || '/' }).catch(() => setError(true));
  };
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    perform();
  }, [signOut]);
  return (
    <div className="flex min-h-[50dvh] items-center justify-center font-display text-xl font-bold text-[#232a16]" data-testid="status-signing-out">
      {error ? <div role="alert" className="text-center"><p>Sign-out could not complete. Check your connection.</p><button type="button" onClick={perform} className="mt-4 rounded-full bg-[#232a16] px-5 py-2 text-[#ecf39e]">Try again</button></div> : 'Signing you out...'}
    </div>
  );
}
