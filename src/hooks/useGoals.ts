import { useCallback, useEffect, useState } from 'react';
import { GoalStore, type Goal, type GoalType } from '../services';

export interface NewGoalInput {
  title: string;
  type?: GoalType;
  estimatedHours?: number;
  targetDate?: string;
}

/**
 * useGoals — stateful wrapper around the GoalStore repository.
 * Loads goals on mount (migrating any legacy PWA data once) and
 * re-reads after every mutation so the UI stays in sync.
 */
export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await GoalStore.load();
    setGoals(data.goals);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await GoalStore.init();        // one-time import of legacy PWA data
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const addGoal = useCallback(async (input: NewGoalInput) => {
    await GoalStore.add(input);
    await refresh();
  }, [refresh]);

  const removeGoal = useCallback(async (id: string) => {
    await GoalStore.remove(id);
    await refresh();
  }, [refresh]);

  const logHours = useCallback(async (id: string, hours: number) => {
    if (!hours) return;
    await GoalStore.logHours(id, hours);
    await refresh();
  }, [refresh]);

  return {
    goals,
    loading,
    refresh,
    addGoal,
    removeGoal,
    logHours,
    progress: (g: Goal) => GoalStore.progress(g),
    totalLogged: (g: Goal) => GoalStore.totalLogged(g),
  };
}
