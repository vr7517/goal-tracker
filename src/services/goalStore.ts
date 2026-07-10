import { Storage } from './storage';

export const GOAL_TYPES = [
  'Learning', 'Career', 'Fitness', 'Project',
  'Creative', 'Finance', 'Personal', 'Other',
] as const;
export type GoalType = (typeof GOAL_TYPES)[number];

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  estimatedHours: number;
  createdAt: string;                 // ISO date (YYYY-MM-DD)
  targetDate?: string;               // ISO date
  logs: Record<string, number>;      // ISO date -> hours logged that day
}

export interface GoalData {
  goals: Goal[];
}

/** Same key the original Cadence PWA used, so existing data is picked up after migration. */
const STORE_KEY = 'cadence:data:v1';
const LEGACY_KEYS = [STORE_KEY];

const uid = () => Math.random().toString(36).slice(2, 10);
const isoToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Typed repository for the goal data, built on the Storage service. */
export const GoalStore = {
  /** Call once at app start to import any legacy PWA data. */
  async init(): Promise<void> {
    await Storage.migrateFromLocalStorage(LEGACY_KEYS);
  },
  async load(): Promise<GoalData> {
    return Storage.getJSON<GoalData>(STORE_KEY, { goals: [] });
  },
  async save(data: GoalData): Promise<void> {
    await Storage.setJSON(STORE_KEY, data);
  },
  async add(input: { title: string; type?: GoalType; estimatedHours?: number; targetDate?: string }): Promise<Goal> {
    const data = await this.load();
    const goal: Goal = {
      id: uid(),
      title: input.title.trim(),
      type: input.type ?? 'Personal',
      estimatedHours: input.estimatedHours ?? 0,
      createdAt: isoToday(),
      targetDate: input.targetDate,
      logs: {},
    };
    data.goals.unshift(goal);
    await this.save(data);
    return goal;
  },
  async remove(id: string): Promise<void> {
    const data = await this.load();
    data.goals = data.goals.filter((g) => g.id !== id);
    await this.save(data);
  },
  async logHours(id: string, hours: number, date = isoToday()): Promise<void> {
    const data = await this.load();
    const goal = data.goals.find((g) => g.id === id);
    if (!goal) return;
    goal.logs[date] = (goal.logs[date] ?? 0) + hours;
    await this.save(data);
  },
  totalLogged(goal: Goal): number {
    return Object.values(goal.logs).reduce((a, b) => a + b, 0);
  },
  progress(goal: Goal): number {
    if (!goal.estimatedHours) return 0;
    return Math.min(1, this.totalLogged(goal) / goal.estimatedHours);
  },
};
