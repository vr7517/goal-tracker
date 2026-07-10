import { useState } from 'react';
import { GOAL_TYPES, type GoalType } from '../services';
import type { NewGoalInput } from '../hooks';

export function GoalForm({ onAdd }: { onAdd: (input: NewGoalInput) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<GoalType>('Learning');
  const [hours, setHours] = useState('20');
  const [target, setTarget] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    if (!title.trim()) {
      setError('Give your goal a title.');
      return;
    }
    setError('');
    await onAdd({
      title,
      type,
      estimatedHours: Number(hours) || 0,
      targetDate: target || undefined,
    });
    setTitle('');
    setHours('20');
    setTarget('');
  };

  return (
    <section className="card">
      <h2>New goal</h2>
      <div className="field">
        <label htmlFor="g-title">Title</label>
        <input
          id="g-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Pass AZ-305"
        />
      </div>
      <div className="row">
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="g-type">Type</label>
          <select id="g-type" value={type} onChange={(e) => setType(e.target.value as GoalType)}>
            {GOAL_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field" style={{ width: 120 }}>
          <label htmlFor="g-hours">Est. hours</label>
          <input
            id="g-hours"
            type="number"
            inputMode="numeric"
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="g-target">Target date (optional)</label>
        <input id="g-target" type="date" value={target} onChange={(e) => setTarget(e.target.value)} />
      </div>
      {error && <p className="err">{error}</p>}
      <button className="btn" onClick={submit}>Add goal</button>
    </section>
  );
}
