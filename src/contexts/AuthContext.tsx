import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { User } from '@firebase/auth';
import { FirebaseAuthService } from '../services/FirebaseAuthService';
import { GuestSessionService } from '../services/GuestSessionService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sessionMode: AuthSessionMode;
  isGuestSession: boolean;
  isDemoSession: boolean;
  enterGuestMode: (options?: { seedDemoData?: boolean }) => Promise<void>;
  loadDemoData: () => Promise<void>;
  signOut: () => Promise<void>;
}

export type AuthSessionMode =
  | 'signed_out'
  | 'account'
  | 'guest'
  | 'demo'
  | 'test';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type E2EBypassWindow = Window & {
  __SPARK_E2E_TEST_MODE__?: boolean;
  __SPARK_E2E_AUTH_BYPASS__?: {
    enabled?: boolean;
    uid?: string;
    email?: string | null;
    displayName?: string | null;
  };
};

const getE2EBypassUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const e2eWindow = window as E2EBypassWindow;
  const bypassConfig = e2eWindow.__SPARK_E2E_AUTH_BYPASS__;
  if (
    e2eWindow.__SPARK_E2E_TEST_MODE__ !== true ||
    bypassConfig?.enabled !== true
  ) {
    return null;
  }

  return {
    uid: bypassConfig.uid ?? 'e2e-anonymous-shell',
    email: bypassConfig.email ?? null,
    displayName: bypassConfig.displayName ?? 'E2E Anonymous Shell',
    isAnonymous: true,
  } as User;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionMode, setSessionMode] = useState<AuthSessionMode>('signed_out');
  // Track whether the E2E bypass was applied so Firebase's async
  // onAuthStateChanged callback cannot overwrite it with null.
  const bypassActive = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => {};

    const initializeAuth = async () => {
      const bypassUser = getE2EBypassUser();
      if (bypassUser) {
        bypassActive.current = true;
        if (isMounted) {
          setUser(bypassUser);
          setSessionMode('test');
          setLoading(false);
        }
        return;
      }

      const guestSession = await GuestSessionService.restoreSession();
      if (guestSession) {
        if (isMounted) {
          setUser(GuestSessionService.createGuestUser(guestSession));
          setSessionMode(guestSession.seedDemoData ? 'demo' : 'guest');
          setLoading(false);
        }
        return;
      }

      unsubscribe = FirebaseAuthService.subscribeToAuthChanges(
        (firebaseUser) => {
          if (bypassActive.current || !isMounted) {
            return;
          }
          setUser(firebaseUser);
          setSessionMode(firebaseUser ? 'account' : 'signed_out');
          setLoading(false);
        },
      );
    };

    initializeAuth().catch(() => undefined);

    return () => {
      isMounted = false;
      bypassActive.current = false;
      unsubscribe();
    };
  }, []);

  const enterGuestMode = async ({
    seedDemoData = false,
  }: {
    seedDemoData?: boolean;
  } = {}) => {
    const record = await GuestSessionService.startSession({ seedDemoData });
    setUser(GuestSessionService.createGuestUser(record));
    setSessionMode(seedDemoData ? 'demo' : 'guest');
    setLoading(false);
  };

  const loadDemoData = async () => {
    const record = await GuestSessionService.enableDemoData();
    setUser(GuestSessionService.createGuestUser(record));
    setSessionMode('demo');
    setLoading(false);
  };

  const signOut = async () => {
    if (sessionMode === 'guest' || sessionMode === 'demo') {
      await GuestSessionService.clearSession();
      setUser(null);
      setSessionMode('signed_out');
      return;
    }

    await FirebaseAuthService.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sessionMode,
        isGuestSession: sessionMode === 'guest' || sessionMode === 'demo',
        isDemoSession: sessionMode === 'demo',
        enterGuestMode,
        loadDemoData,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
