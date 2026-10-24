import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListWorkouts, saveCloudWorkout, deleteCloudWorkout, importWorkouts,
} from '@workspace/api-client-react';
import { WORKOUT_STORAGE_KEY, deleteWorkout, loadWorkouts, saveWorkout, type Workout } from '@/lib/workout-storage';

export function workoutError(error: unknown): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = error.data;
    if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') return data.error;
  }
  return error instanceof Error ? error.message : 'The request failed. Your unsaved draft has not been discarded.';
}

function readLocal() {
  try { return { list: loadWorkouts(), error: null as string | null }; }
  catch (e) { return { list: [] as Workout[], error: workoutError(e) }; }
}

export function useWorkoutRepository() {
  const { isSignedIn, userId } = useAuth();
  const cloud = Boolean(isSignedIn);
  const [local, setLocal] = useState(readLocal);
  useEffect(() => {
    const reload = () => setLocal(readLocal());
    const onStorage = (event: StorageEvent) => {
      if (event.key === WORKOUT_STORAGE_KEY || event.key === null) reload();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', reload);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', reload);
    };
  }, []);
  const qc = useQueryClient();
  const key = ['cloud-workouts', userId] as const;
  const query = useListWorkouts({
    query: {
      queryKey: key, enabled: cloud, retry: false,
      refetchInterval: 30000, refetchOnWindowFocus: true,
    },
    request: { credentials: 'include' },
  });

  const list: Workout[] = cloud ? query.data ?? [] : local.list;
  const refresh = async () => {
    if (cloud) {
      const result = await query.refetch({ throwOnError: true });
      if (result.error) throw result.error;
      return result.data ?? [];
    }
    const result = readLocal();
    setLocal(result);
    if (result.error) throw new Error(result.error);
    return result.list;
  };
  const save = async (workout: Workout, isNew: boolean): Promise<Workout> => {
    if (cloud) {
      const saved = await saveCloudWorkout(workout.id, { ...workout, isNew }, { credentials: 'include' });
      // A list request started before the write may still contain the old
      // version. Abort it before applying the authoritative mutation result.
      await qc.cancelQueries({ queryKey: key });
      qc.setQueryData<Workout[]>(key, (old = []) => [saved, ...old.filter((w) => w.id !== saved.id)]);
      return saved;
    }
    saveWorkout(workout);
    const rows = await refresh();
    return rows.find((w) => w.id === workout.id)!;
  };
  const remove = async (workout: Workout) => {
    if (cloud) {
      await deleteCloudWorkout(workout.id, { updatedAt: workout.updatedAt }, { credentials: 'include' });
      await qc.cancelQueries({ queryKey: key });
      qc.setQueryData<Workout[]>(key, (old = []) => old.filter((w) => w.id !== workout.id));
    } else {
      deleteWorkout(workout.id);
      await refresh();
    }
  };
  const copyLocal = async () => {
    if (!cloud) throw new Error('Sign in before copying routines to your account.');
    // Re-read, rather than importing an old snapshot from another browser tab.
    const rows = loadWorkouts();
    const totals = { imported: 0, skipped: 0 };
    try {
      // One routine per request also supports large local libraries without
      // exceeding request limits. Retrying is safe because IDs are idempotent.
      for (const w of rows) {
        const result = await importWorkouts({ workouts: [{ ...w, isNew: true }] }, { credentials: 'include' });
        totals.imported += result.imported;
        totals.skipped += result.skipped;
      }
      await refresh();
      return totals;
    } catch (error) {
      void query.refetch();
      throw new Error(`Copied ${totals.imported} routine(s) before stopping. ${workoutError(error)} Local copies are unchanged. Retrying will skip routines already copied.`);
    }
  };
  return {
    cloud, list, loading: cloud && query.isPending, fetching: cloud && query.isFetching,
    loadError: cloud ? query.error ? workoutError(query.error) : null : local.error,
    localCopies: local.list, localError: local.error,
    refresh, save, remove, copyLocal,
  };
}
