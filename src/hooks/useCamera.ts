import { useCallback, useState } from 'react';
import { CameraSource } from '@capacitor/camera';
import { CameraService, type CapturedPhoto } from '../services';

/** useCamera — take or pick a photo, handling permissions and cancel. */
export function useCamera() {
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(async (source: CameraSource = CameraSource.Prompt) => {
    setBusy(true);
    setError(null);
    try {
      const perm = await CameraService.checkPermissions();
      if (perm.camera !== 'granted' && perm.photos !== 'granted') {
        await CameraService.requestPermissions();
      }
      const p = await CameraService.take(source);
      setPhoto(p);
      return p;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not capture photo';
      // getPhoto throws on user cancel too — don't treat that as an error
      setError(/cancel/i.test(msg) ? null : msg);
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  const clear = useCallback(() => setPhoto(null), []);

  return { photo, busy, error, capture, clear, CameraSource };
}
