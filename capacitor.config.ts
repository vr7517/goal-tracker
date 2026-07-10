import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cadence.goaltracker',
  appName: 'Cadence',
  webDir: 'dist',
  backgroundColor: '#ECF0EE',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#0D8A80',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#0D8A80',
    },
  },
  // For live reload on a device during dev, uncomment and set your machine's LAN IP:
  // server: { url: 'http://192.168.1.50:5173', cleartext: true },
};

export default config;
