import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapApp } from '@capacitor/app';
import { useGoals } from './hooks';
import { GoalForm, GoalList, CameraCard, LocationCard, ReminderCard } from './components';

export default function App() {
  const goals = useGoals();
  const [platform] = useState(() => Capacitor.getPlatform());

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    (async () => {
      try {
        await StatusBar.setStyle({ style: Style.Light });
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#0D8A80' });
        }
      } catch {
        /* status bar unavailable */
      }
      try {
        await SplashScreen.hide();
      } catch {
        /* splash screen unavailable */
      }
    })();

    // Android hardware back button: navigate back, or exit at the root
    const handle = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else void CapApp.exitApp();
    });
    return () => { void handle.then((h) => h.remove()); };
  }, []);

  return (
    <div className="app">
      <header className="app-head">
        <h1>Cadence</h1>
        <span className="badge">{platform}</span>
      </header>

      <GoalForm onAdd={goals.addGoal} />
      <GoalList
        goals={goals.goals}
        loading={goals.loading}
        onLog={goals.logHours}
        onRemove={goals.removeGoal}
        progress={goals.progress}
        totalLogged={goals.totalLogged}
      />

      <CameraCard />
      <LocationCard />
      <ReminderCard />

      <p className="muted" style={{ textAlign: 'center', marginTop: 24 }}>
        Cadence Â· offline-first Â· your data stays on device
      </p>
    </div>
  );
}
