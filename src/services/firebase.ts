/**
 * firebase.ts
 * Firebase app initialisation and auth exports for ADHD-CADDI.
 *
 * The config values below come from the Firebase console for project adhd-3f643.
 * They are intentionally public (Firebase API keys are not secrets — they
 * identify the project, not grant admin access). Real secrets live in
 * server-side env vars or CI secrets.
 *
 * To swap projects, update EXPO_PUBLIC_FIREBASE_* env vars in .env
 * (or replace the fallback strings here).
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  GoogleAuthProvider,
  EmailAuthProvider,
} from 'firebase/auth';

// ─── Firebase project config (adhd-3f643) ────────────────────────────────────
const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ??
    'AIzaSyAlO-f1PEwV4C8cOUYCc5LiJ02IWh3IoPA',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    'adhd-3f643.firebaseapp.com',
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'adhd-3f643',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    'adhd-3f643.firebasestorage.app',
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '239988407398',
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ??
    '1:239988407398:web:d085da279a7a70f6e301a7',
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-QPP8H2B002',
};

// ─── App singleton (safe to call multiple times — e.g. hot reload) ───────────
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ─── Auth ────────────────────────────────────────────────────────────────────
// On React Native / Expo we need to choose a persistence adapter.
// We use a lazy import so the web bundle never pulls in the native adapter.
let auth: ReturnType<typeof getAuth>;

try {
  // Expo / React Native: use AsyncStorage persistence if available
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getReactNativePersistence } = require('firebase/auth');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // Web or already initialised — fall back to default (localStorage) persistence
  auth = getAuth(firebaseApp);
}

// ─── Auth providers ──────────────────────────────────────────────────────────
/** Pre-configured Google provider. Scopes added for Tasks/Calendar sync. */
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/tasks');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.setCustomParameters({ prompt: 'select_account' });

/** Pre-configured Email/Password provider (used for linking accounts). */
export const emailProvider = new EmailAuthProvider();

// ─── Exports ─────────────────────────────────────────────────────────────────
export { auth, firebaseApp };
export default firebaseApp;
