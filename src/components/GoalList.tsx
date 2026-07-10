import { useState } from 'react';
import type { Goal } from '../services';

interface Props {
  goals: Goal[];
  loading: boolean;
  onLog: (id: string, hours: number) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  progress: (g: Goal) => number;
  totalLogged: (g: Goal) => number;
}

export function GoalList({ goals, loading, onLog, onRemove, progress, totalLogged }: Props) {
  if (loading) {
    return <section className="card"><p className="muted">Loading your goalsâ¦</p></section>;
  }
  if (!goals.length) {
    return <section className="card"><p className="muted">No goals yet â add your first one above.</p></section>;
  }
  return (
    <section className="card">
      <h2>Your goals</h2>
      {goals.map((g) => (
        <GoalRow
          key={g.id}
          goal={g}
          onLog={onLog}
          onRemove={onRemove}
          progress={progress}
          totalLogged={totalLogged}
        />
      ))}
    </section>
  );
}

type RowProps = { goal: Goal } & Omit<Props, 'goals' | 'loading'>;

function GoalRow({ goal, onLog, onRemove, progress, totalLogged }: RowProps) {
  const [amt, setAmt] = useState('1');
  const pct = Math.round(progress(goal) * 100);
  return (
    <div className="goal">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <strong>{goal.title}</strong>
        <span className="badge">{goal.type}</span>
      </div>
      <div className="pbar"><i style={{ width: `${pct}%` }} /></div>
      <p className="muted" style={{ margin: '6px 0 8px' }}>
        {totalLogged(goal)}h logged{goal.estimatedHours ? ` of ${goal.estimatedHours}h Â· ${pct}%` : ''}
      </p>
      <div className="row">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.5"
          value={amt}
          onChange={(e) => setAmt(e.target.value)}
          style={{ width: 90 }}
        />
        <button className="btn secondary" onClick={() => onLog(goal.id, Number(amt) || 0)}>Log hours</button>
        <button className="btn ghost" style={{ marginLeft: 'auto' }} onClick={() => onRemove(goal.id)}>Delete</button>
      </div>
    </div>
  );
}
