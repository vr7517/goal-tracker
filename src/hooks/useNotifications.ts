import { useCallback, useEffect, useState } from 'react';
import { NotificationService } from '../services';

interface PendingItem { id: number; title?: string }

/** useNotifications — permission state, test/daily scheduling, pending list. */
export function useNotifications() {
  const [granted, setGranted] = useState<boolean | null>(null);
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPending = useCallback(async () => {
    try {
      const list = await NotificationService.pending();
      setPending(list.map((n) => ({ id: n.id, title: n.title })));
    } catch {
      // web fallback may not support getPending
    }
  }, []);

  const checkPermission = useCallback(async () => {
    try {
      const s = await NotificationService.checkPermissions();
      setGranted(s.display === 'granted');
    } catch {
      setGranted(false);
    }
  }, []);

  useEffect(() => {
    void checkPermission();
    void refreshPending();
  }, [checkPermission, refreshPending]);

  const enable = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const s = await NotificationService.requestPermissions();
      const ok = s.display === 'granted';
      setGranted(ok);
      return ok;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not enable notifications');
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const sendTest = useCallback(async () => {
    setError(null);
    try {
      await NotificationService.notifyNow('Cadence', 'This is a test reminder ð¯');
      await refreshPending();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send notification');
    }
  }, [refreshPending]);

  const scheduleDaily = useCallback(async (hour: number, minute: number) => {
    setError(null);
    try {
      await NotificationService.scheduleDailyReminder(
        'Cadence', 'Time to log progress on your goals.', hour, minute,
      );
      await refreshPending();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not schedule reminder');
    }
  }, [refreshPending]);

  const cancel = useCallback(async (id: number) => {
    await NotificationService.cancel(id);
    await refreshPending();
  }, [refreshPending]);

  return { granted, pending, busy, error, enable, sendTest, scheduleDaily, cancel, refreshPending };
}
