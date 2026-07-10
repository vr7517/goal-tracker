# Cadence — Mobile (Capacitor) Setup

This turns the Cadence goal-tracker PWA into a native **iOS & Android** app using
[Capacitor](https://capacitorjs.com). The web app is built with Vite + React + TypeScript
and wrapped in a native shell; the same code runs on web, iOS, and Android.

## What's in here

```
src/
  services/     Storage · Camera · Notifications · Geolocation · GoalStore (typed repo)
  hooks/        useGoals · useCamera · useGeolocation · useNotifications
  components/   GoalForm · GoalList · CameraCard · LocationCard · ReminderCard
  App.tsx       wires hooks + components, handles splash/status-bar/back-button
capacitor.config.ts   app id, name, splash + notification plugin config
android/ · ios/       native config files (permissions, plist, resources)
legacy/               the original PWA, kept for reference
```

## Prerequisites

- **Node.js 20+** and npm
- **Android:** Android Studio + JDK 17 (Android SDK, an emulator or device)
- **iOS:** a Mac with Xcode 15+ and CocoaPods (`sudo gem install cocoapods`)

## First-time setup

```bash
# 1. install JS dependencies
npm install

# 2. build the web assets into dist/
npm run build

# 3. generate the native projects (creates full android/ and ios/ folders)
npx cap add android
npx cap add ios

# 4. copy web assets + plugins into the native projects
npx cap sync
```

> The `android/` and `ios/` folders in this repo contain the **config files you must
> keep** (permissions, Info.plist usage strings, FileProvider paths). Step 3 scaffolds
> the rest of each native project *around* them. If the CLI reports a conflict on a file
> shipped here, keep this version — it already has the permissions the plugins need.

## Run it

```bash
npm run dev          # web preview in the browser (fastest feedback loop)
npm run android      # build + sync + open Android Studio
npm run ios          # build + sync + open Xcode
```

Then press Run in Android Studio / Xcode to deploy to an emulator or device.

## Permissions already configured

| Feature        | Android (`AndroidManifest.xml`)                          | iOS (`Info.plist`)                          |
|----------------|----------------------------------------------------------|---------------------------------------------|
| Camera         | `CAMERA`, `READ_MEDIA_IMAGES`, FileProvider              | `NSCameraUsageDescription`, `NSPhotoLibrary…` |
| Location       | `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`         | `NSLocationWhenInUseUsageDescription`        |
| Notifications  | `POST_NOTIFICATIONS`, `SCHEDULE_EXACT_ALARM`, boot recv. | (requested at runtime; no plist key needed)  |
| Storage        | none (Preferences uses app-private storage)              | none                                         |

## Data migration

`GoalStore.init()` (called by `useGoals` on first mount) copies any existing
`cadence:data:v1` value from the old PWA's `localStorage` into Capacitor Preferences
exactly once, so users keep their goals when they move to the native app.

## Live reload on a device (optional)

Uncomment the `server` block in `capacitor.config.ts`, set it to your machine's LAN IP,
then `npm run dev` and `npx cap run android -l --external`.
