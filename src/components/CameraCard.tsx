import { useCamera } from '../hooks';

export function CameraCard() {
  const { photo, busy, error, capture, clear, CameraSource } = useCamera();
  return (
    <section className="card">
      <h2>Progress photo</h2>
      <p className="muted">Snap a milestone shot - uses the native camera on device, a file picker on web.</p>
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn" disabled={busy} onClick={() => void capture(CameraSource.Camera)}>
          {busy ? 'Opening...' : 'Take photo'}
        </button>
        <button className="btn secondary" disabled={busy} onClick={() => void capture(CameraSource.Photos)}>
          Choose from gallery
        </button>
        {photo && (
          <button className="btn ghost" style={{ marginLeft: 'auto' }} onClick={clear}>Clear</button>
        )}
      </div>
      {error && <p className="err">{error}</p>}
      {photo?.dataUrl && <img className="photo" src={photo.dataUrl} alt="Progress" />}
    </section>
  );
}
