import { Preferences } from '@capacitor/preferences';

/**
 * Storage service — a thin, typed wrapper over @capacitor/preferences.
 * Works on web, iOS, and Android with the same API.
 */
export const Storage = {
  async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  },
  async set(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  },
  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  },
  async keys(): Promise<string[]> {
    const { keys } = await Preferences.keys();
    return keys;
  },
  async clear(): Promise<void> {
    await Preferences.clear();
  },

  async getJSON<T>(key: string, fallback: T): Promise<T> {
    const raw = await this.get(key);
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  async setJSON<T>(key: string, value: T): Promise<void> {
    await this.set(key, JSON.stringify(value));
  },

  /**
   * One-time import of the existing PWA's data from window.localStorage
   * into Capacitor Preferences. Safe to call on every launch — it only
   * runs once and never overwrites values already in Preferences.
   */
  async migrateFromLocalStorage(legacyKeys: string[]): Promise<number> {
    const FLAG = '__cadence_migrated__';
    if (typeof localStorage === 'undefined') return 0;
    if (await this.get(FLAG)) return 0;

    let moved = 0;
    for (const key of legacyKeys) {
      const legacyValue = localStorage.getItem(key);
      if (legacyValue != null && (await this.get(key)) == null) {
        await this.set(key, legacyValue);
        moved++;
      }
    }
    await this.set(FLAG, new Date().toISOString());
    return moved;
  },
};
