import React from 'react';
import { Text } from 'react-native';
import { act, render, screen, waitFor } from '@testing-library/react-native';
import {
  AuthProvider,
  useAuth,
  type AuthSessionMode,
} from '../src/contexts/AuthContext';

const mockSubscribeToAuthChanges = jest.fn();
const mockFirebaseSignOut = jest.fn();
const mockRestoreGuestSession = jest.fn();
const mockStartGuestSession = jest.fn();
const mockClearGuestSession = jest.fn();

jest.mock('../src/services/FirebaseAuthService', () => ({
  FirebaseAuthService: {
    subscribeToAuthChanges: (...args: unknown[]) =>
      mockSubscribeToAuthChanges(...args),
    signOut: (...args: unknown[]) => mockFirebaseSignOut(...args),
  },
}));

jest.mock('../src/services/GuestSessionService', () => ({
  GuestSessionService: {
    restoreSession: (...args: unknown[]) => mockRestoreGuestSession(...args),
    startSession: (...args: unknown[]) => mockStartGuestSession(...args),
    clearSession: (...args: unknown[]) => mockClearGuestSession(...args),
    createGuestUser: jest.fn((overrides?: Record<string, unknown>) => ({
      uid: 'guest-local',
      isAnonymous: true,
      email: null,
      displayName: 'Guest Mode',
      ...overrides,
    })),
  },
}));

const AuthProbe = () => {
  const {
    user,
    loading,
    sessionMode,
    isGuestSession,
    isDemoSession,
    enterGuestMode,
    signOut,
  } = useAuth();

  return (
    <>
      <Text testID="auth-loading">{String(loading)}</Text>
      <Text testID="auth-session-mode">{sessionMode}</Text>
      <Text testID="auth-user">{user?.uid ?? 'none'}</Text>
      <Text testID="auth-is-guest">{String(isGuestSession)}</Text>
      <Text testID="auth-is-demo">{String(isDemoSession)}</Text>
      <Text
        testID="auth-enter-guest"
        onPress={() => {
          void enterGuestMode();
        }}
      >
        ENTER_GUEST
      </Text>
      <Text
        testID="auth-enter-demo"
        onPress={() => {
          void enterGuestMode({ seedDemoData: true });
        }}
      >
        ENTER_DEMO
      </Text>
      <Text
        testID="auth-sign-out"
        onPress={() => {
          void signOut();
        }}
      >
        SIGN_OUT
      </Text>
    </>
  );
};

describe('AuthContext guest session support', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSubscribeToAuthChanges.mockImplementation(
      (callback: (user: unknown) => void) => {
        callback(null);
        return jest.fn();
      },
    );
    mockRestoreGuestSession.mockResolvedValue(null);
    mockStartGuestSession.mockResolvedValue({ seedDemoData: false });
    mockClearGuestSession.mockResolvedValue(undefined);
    mockFirebaseSignOut.mockResolvedValue({ error: null });
  });

  const renderAuthProvider = () =>
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

  it('restores a persisted local guest session before falling back to Firebase auth', async () => {
    mockRestoreGuestSession.mockResolvedValue({
      id: 'guest-local',
      seedDemoData: false,
    });

    renderAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('auth-session-mode')).toHaveTextContent(
      'guest' satisfies AuthSessionMode,
    );
    expect(screen.getByTestId('auth-user')).toHaveTextContent('guest-local');
    expect(screen.getByTestId('auth-is-guest')).toHaveTextContent('true');
    expect(mockSubscribeToAuthChanges).not.toHaveBeenCalled();
  });

  it('enters local demo guest mode without calling Firebase auth', async () => {
    renderAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-loading')).toHaveTextContent('false');
    });

    await act(async () => {
      screen.getByTestId('auth-enter-demo').props.onPress();
    });

    expect(mockStartGuestSession).toHaveBeenCalledWith({ seedDemoData: true });
    expect(mockSubscribeToAuthChanges).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('auth-session-mode')).toHaveTextContent('demo');
    expect(screen.getByTestId('auth-is-demo')).toHaveTextContent('true');
  });

  it('signs out a local guest session by clearing the persisted guest record', async () => {
    mockRestoreGuestSession.mockResolvedValue({
      id: 'guest-local',
      seedDemoData: false,
    });

    renderAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-session-mode')).toHaveTextContent(
        'guest',
      );
    });

    await act(async () => {
      screen.getByTestId('auth-sign-out').props.onPress();
    });

    expect(mockClearGuestSession).toHaveBeenCalledTimes(1);
    expect(mockFirebaseSignOut).not.toHaveBeenCalled();
    expect(screen.getByTestId('auth-user')).toHaveTextContent('none');
  });
});
