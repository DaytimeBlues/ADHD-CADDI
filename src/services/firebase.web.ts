import { initializeApp, getApps, getApp } from '@firebase/app';
import {
  initializeAuth,
  GoogleAuthProvider,
  EmailAuthProvider,
  browserLocalPersistence,
  browserPopupRedirectResolver,
} from '@firebase/auth';

/**
 * firebase.web.ts
 * Firebase app initialisation and auth exports for the Firebase-hosted web app.
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

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = initializeAuth(firebaseApp, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/tasks');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const emailProvider = new EmailAuthProvider();

export { auth, firebaseApp };
export default firebaseApp;
