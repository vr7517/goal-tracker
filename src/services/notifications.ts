import { LocalNotifications, type PermissionStatus } from '@capacitor/local-notifications';

/** Notifications service — wraps @capacitor/local-notifications. */
export const NotificationService = {
  requestPermissions(): Promise<PermissionStatus> {
    return LocalNotifications.requestPermissions();
  },
  checkPermissions(): Promise<PermissionStatus> {
    return LocalNotifications.checkPermissions();
  },
  async notifyNow(title: string, body: string): Promise<number> {
    const id = Math.floor(Math.random() * 1_000_000);
    await LocalNotifications.schedule({
      notifications: [{ id, title, body, schedule: { at: new Date(Date.now() + 500) } }],
    });
    return id;
  },
  async scheduleAt(title: string, body: string, at: Date, id = Math.floor(Math.random() * 1_000_000)): Promise<number> {
    await LocalNotifications.schedule({
      notifications: [{ id, title, body, schedule: { at } }],
    });
    return id;
  },
  /** Repeating daily reminder at the given local hour/minute. */
  async scheduleDailyReminder(title: string, body: string, hour: number, minute: number, id = 1001): Promise<number> {
    await LocalNotifications.schedule({
      notifications: [{
        id,
        title,
        body,
        schedule: { on: { hour, minute }, allowWhileIdle: true },
      }],
    });
    return id;
  },
  async cancel(id: number): Promise<void> {
    await LocalNotifications.cancel({ notifications: [{ id }] });
  },
  async pending() {
    const result = await LocalNotifications.getPending();
    return result.notifications;
  },
};
