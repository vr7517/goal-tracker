import { useGeolocation } from '../hooks';

export function LocationCard() {
  const { coords, busy, error, watching, locate, startWatch, stopWatch } = useGeolocation();
  return (
    <section className="card">
      <h2>Check-in location</h2>
      <p className="muted">Tag where you did the work - handy for gym or study-spot streaks.</p>
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn" disabled={busy} onClick={() => void locate()}>
          {busy ? 'Locating...' : 'Get location'}
        </button>
        <button
          className="btn secondary"
          onClick={() => (watching ? void stopWatch() : void startWatch())}
        >
          {watching ? 'Stop watching' : 'Watch position'}
        </button>
      </div>
      {error && <p className="err">{error}</p>}
      {coords && (
        <ul className="list">
          <li>Latitude: {coords.lat.toFixed(5)}</li>
          <li>Longitude: {coords.lng.toFixed(5)}</li>
          <li>Accuracy: +/-{Math.round(coords.accuracy)} m</li>
          <li>Updated: {new Date(coords.timestamp).toLocaleTimeString()}</li>
        </ul>
      )}
    </section>
  );
}
