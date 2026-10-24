import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import NotFound from '@/pages/not-found';
import Explorer from '@/pages/explorer';
import MusclePage from '@/pages/muscle-page';
import Exercises from '@/pages/exercises';
import ExerciseDetail from '@/pages/exercise-detail';
import NewToGym from '@/pages/new-to-gym';
import Workouts from '@/pages/workouts';
import About from '@/pages/about';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Explorer} />
        <Route path="/muscles/:slug" component={MusclePage} />
        <Route path="/exercises" component={Exercises} />
        <Route path="/exercises/:slug" component={ExerciseDetail} />
        <Route path="/new-to-gym" component={NewToGym} />
        <Route path="/workouts" component={Workouts} />
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <div className="grain flex min-h-[100dvh] flex-col">
            <SiteHeader />
            <main className="flex-1">
              <Router />
            </main>
            <SiteFooter />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
