import { useState } from 'react';
import { useNotifications } from '../hooks';

export function ReminderCard() {
  const { granted, pending, busy, error, enable, sendTest, scheduleDaily, cancel } = useNotifications();
  const [time, setTime] = useState('19:00');

  const schedule = async () => {
    const [h, m] = time.split(':').map(Number);
    await scheduleDaily(h, m);
  };

  return (
    <section className="card">
      <h2>Daily reminder</h2>
      <p className="muted">
        {granted === null
          ? 'Checking notification permissionâ¦'
          : granted
            ? 'Notifications are enabled.'
            : 'Enable notifications to get a daily nudge.'}
      </p>
      <div className="row" style={{ marginTop: 10 }}>
        {!granted && (
          <button className="btn" disabled={busy} onClick={() => void enable()}>Enable notifications</button>
        )}
        <button className="btn secondary" disabled={!granted} onClick={() => void sendTest()}>Send test</button>
      </div>
      <div className="row" style={{ marginTop: 10, alignItems: 'flex-end' }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="r-time">Remind me daily at</label>
          <input
            id="r-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ width: 140 }}
          />
        </div>
        <button className="btn" disabled={!granted} onClick={() => void schedule()}>Schedule</button>
      </div>
      {error && <p className="err">{error}</p>}
      {pending.length > 0 && (
        <ul className="list">
          {pending.map((n) => (
            <li key={n.id} className="row" style={{ justifyContent: 'space-between' }}>
              <span>#{n.id} {n.title ?? ''}</span>
              <button className="btn ghost" onClick={() => void cancel(n.id)}>Cancel</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
