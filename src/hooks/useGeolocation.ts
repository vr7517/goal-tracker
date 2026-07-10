import { useCallback, useEffect, useRef, useState } from 'react';
import { GeolocationService, type Coords } from '../services';

/** useGeolocation — one-shot location plus an optional live watch. */
export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const watchId = useRef<string | null>(null);

  const locate = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await GeolocationService.requestPermissions();
      const c = await GeolocationService.current();
      setCoords(c);
      return c;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not get location');
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  const stopWatch = useCallback(async () => {
    if (watchId.current) {
      await GeolocationService.clearWatch(watchId.current);
      watchId.current = null;
    }
    setWatching(false);
  }, []);

  const startWatch = useCallback(async () => {
    setError(null);
    try {
      await GeolocationService.requestPermissions();
      const id = await GeolocationService.watch((c) => setCoords(c));
      watchId.current = id;
      setWatching(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not watch location');
    }
  }, []);

  // clean up the watch if the component unmounts
  useEffect(() => () => { void stopWatch(); }, [stopWatch]);

  return { coords, busy, error, watching, locate, startWatch, stopWatch };
}
