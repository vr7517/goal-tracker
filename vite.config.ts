import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Capacitor loads the built assets from `dist/`
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'dist' },
  server: { host: true }, // allows live-reload on a device over LAN
});
