import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  GoogleAuthProvider,
  EmailAuthProvider,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  Auth,
} from 'firebase/auth';
import { Platform } from 'react-native';

/**
 * firebase.ts
 * Firebase app initialisation and auth exports for ADHD-CADDI.
 *
 * Config values come from the Firebase console for project adhd-3f643.
 * Env vars (EXPO_PUBLIC_FIREBASE_*) override fallbacks if present.
 */
const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ??
    'AIzaSyAlO-f1PEwV4C8cOUYCc5LiJ02IWh3IoPA',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    'adhd-3f643.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'adhd-3f643',
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

// ─── App singleton ────────────────────────────────────────────────────────────────────────────
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ─── Auth Initialization (Cross-Platform Persistence) ────────────────────────────
let auth: Auth;

if (Platform.OS === 'web') {
  // Web: prioritize IndexedDB then BrowserLocal
  auth = initializeAuth(firebaseApp, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  });
} else {
  // Native/Expo: Force AsyncStorage persistence
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getReactNativePersistence } = require('firebase/auth');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AsyncStorage =
      require('@react-native-async-storage/async-storage').default;
    auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (err) {
    // Fallback to default if something goes wrong during initialization
    // eslint-disable-next-line no-console
    console.warn('[Firebase] Fallback auth initialization:', err);
    auth = getAuth(firebaseApp);
  }
}

// ─── Auth providers ────────────────────────────────────────────────────────────────────────────
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/tasks');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const emailProvider = new EmailAuthProvider();

// ─── Exports ───────────────────────────────────────────────────────────────────────────────
export { auth, firebaseApp };
export default firebaseApp;
