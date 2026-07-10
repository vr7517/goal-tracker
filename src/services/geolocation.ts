import { Geolocation, type Position } from '@capacitor/geolocation';

export interface Coords {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

const toCoords = (p: Position): Coords => ({
  lat: p.coords.latitude,
  lng: p.coords.longitude,
  accuracy: p.coords.accuracy,
  timestamp: p.timestamp,
});

/** Geolocation service — wraps @capacitor/geolocation. */
export const GeolocationService = {
  requestPermissions() {
    return Geolocation.requestPermissions();
  },
  checkPermissions() {
    return Geolocation.checkPermissions();
  },
  async current(highAccuracy = true): Promise<Coords> {
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: highAccuracy,
      timeout: 10_000,
    });
    return toCoords(pos);
  },
  async watch(onUpdate: (c: Coords) => void, highAccuracy = true): Promise<string> {
    return Geolocation.watchPosition({ enableHighAccuracy: highAccuracy }, (pos) => {
      if (pos) onUpdate(toCoords(pos));
    });
  },
  async clearWatch(id: string): Promise<void> {
    await Geolocation.clearWatch({ id });
  },
};
