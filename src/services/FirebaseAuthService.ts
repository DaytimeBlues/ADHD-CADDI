import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged,
  User,
  Auth,
} from '@firebase/auth';
import { auth, googleProvider } from './firebase';

const firebaseAuth = auth as Auth;

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const FirebaseAuthService = {
  /**
   * Listen for authentication state changes
   */
  subscribeToAuthChanges: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(firebaseAuth, callback);
  },

  /**
   * Sign in with email and password
   */
  signInWithEmail: async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        pass,
      );
      return { user: result.user, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { user: null, error: message };
    }
  },

  /**
   * Sign up with email and password
   */
  signUpWithEmail: async (email: string, pass: string) => {
    try {
      const result = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        pass,
      );
      return { user: result.user, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { user: null, error: message };
    }
  },

  /**
   * Sign in with Google (Web Popup)
   */
  signInWithGoogleWeb: async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      return { user: result.user, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { user: null, error: message };
    }
  },

  /**
   * Sign in anonymously (Guest Mode)
   */
  signInAnonymously: async () => {
    try {
      const result = await signInAnonymously(firebaseAuth);
      return { user: result.user, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { user: null, error: message };
    }
  },

  /**
   * Sign out
   */
  signOut: async () => {
    try {
      await firebaseSignOut(firebaseAuth);
      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { error: message };
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    return firebaseAuth.currentUser;
  },
};
