import { useEffect, useRef, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ClerkProvider, Show, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { SignInPage, SignOutPage, SignUpPage } from '@/components/auth-pages';
import NotFound from '@/pages/not-found';
import Explorer from '@/pages/explorer';
import MusclePage from '@/pages/muscle-page';
import Exercises from '@/pages/exercises';
import ExerciseDetail from '@/pages/exercise-detail';
import NewToGym from '@/pages/new-to-gym';
import Workouts from '@/pages/workouts';
import WorkoutExercisePage from '@/pages/workout-exercise';
import About from '@/pages/about';
import Coach from '@/pages/coach';
import { CoachWidget } from '@/components/coach/coach-widget';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const INK = '#232a16';
const PAPER = '#f4f2e9';

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: INK,
    colorForeground: INK,
    colorMutedForeground: '#5c6150',
    colorDanger: '#a63a2b',
    colorBackground: PAPER,
    colorInput: '#ffffff',
    colorInputForeground: INK,
    colorNeutral: INK,
    fontFamily: "'DM Sans', sans-serif",
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#f4f2e9] rounded-2xl w-[440px] max-w-full overflow-hidden border-2 border-[#232a16] shadow-[8px_8px_0_#232a16]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: { fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, color: INK },
    headerSubtitle: { color: '#4a503e' },
    socialButtonsBlockButtonText: { color: INK, fontWeight: 600 },
    formFieldLabel: { color: INK, fontWeight: 600 },
    footerActionLink: { color: INK, fontWeight: 700, textDecoration: 'underline' },
    footerActionText: { color: '#4a503e' },
    dividerText: { color: '#4a503e' },
    identityPreviewEditButton: { color: INK },
    formFieldSuccessText: { color: '#3d5a1c' },
    alertText: { color: '#7a2a1e' },
    logoBox: { height: '2.5rem', justifyContent: 'center' },
    logoImage: { height: '2.5rem' },
    socialButtonsBlockButton: { border: `1.5px solid ${INK}`, backgroundColor: '#ffffff' },
    formButtonPrimary: { backgroundColor: INK, color: '#ecf39e', fontWeight: 700 },
    formFieldInput: { border: `1.5px solid ${INK}`, backgroundColor: '#ffffff', color: INK },
    footerAction: { color: INK },
    dividerLine: { backgroundColor: 'rgba(35,42,22,0.25)' },
    alert: { backgroundColor: '#f6dcd6', border: '1px solid #a63a2b' },
    otpCodeFieldInput: { border: `1.5px solid ${INK}`, color: INK },
    formFieldRow: {},
    main: {},
  },
};

const queryClient = new QueryClient();

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/workouts" />
      </Show>
      <Show when="signed-out">
        <Explorer />
      </Show>
    </>
  );
}

function KeyedWorkouts() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return <div className="mx-auto h-64 max-w-7xl animate-pulse px-5 py-10" aria-busy="true" data-testid="skeleton-workouts" />;
  }
  return <Workouts key={user?.id ?? 'guest'} />;
}

function KeyedCoach() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return <div className="mx-auto h-64 max-w-7xl animate-pulse px-5 py-10" aria-busy="true" data-testid="skeleton-coach" />;
  }
  return <Coach key={user?.id ?? 'guest'} />;
}

function KeyedWorkoutExercise() {
  const { user, isLoaded } = useUser();
  return isLoaded
    ? <WorkoutExercisePage key={user?.id ?? 'guest'} />
    : <div className="mx-auto h-64 max-w-3xl animate-pulse px-5 py-10" aria-busy="true" />;
}

function KeyedCoachWidget() {
  const { user, isLoaded } = useUser();
  return isLoaded ? <CoachWidget key={user?.id ?? 'guest'} /> : null;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={HomeRedirect} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/sign-out" component={SignOutPage} />
        <Route path="/muscles/:slug" component={MusclePage} />
        <Route path="/exercises" component={Exercises} />
        <Route path="/exercises/:slug" component={ExerciseDetail} />
        <Route path="/new-to-gym" component={NewToGym} />
        <Route path="/workouts" component={KeyedWorkouts} />
        <Route path="/workouts/:workoutId/exercises/:exerciseId" component={KeyedWorkoutExercise} />
        <Route path="/coach" component={KeyedCoach} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      signInFallbackRedirectUrl={`${basePath}/workouts`}
      signUpFallbackRedirectUrl={`${basePath}/workouts`}
      localization={{
        signIn: { start: { title: 'Welcome back', subtitle: 'Sign in to open your saved workouts' } },
        signUp: { start: { title: 'Create your account', subtitle: 'Keep your workouts private and synced' } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <ClerkQueryClientCacheInvalidator />
      <div className="grain flex min-h-[100dvh] flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Router />
        </main>
        <SiteFooter />
      </div>
      <KeyedCoachWidget />
    </ClerkProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={basePath}>
          <ClerkProviderWithRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
