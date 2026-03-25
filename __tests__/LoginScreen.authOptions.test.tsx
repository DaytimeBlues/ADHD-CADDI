import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';

const mockConfig = {
  environment: 'production' as const,
  googleWebClientId: undefined as string | undefined,
  googleIosClientId: undefined as string | undefined,
  sentryDsn: undefined as string | undefined,
};

jest.mock('../src/config', () => ({
  config: mockConfig,
}));

jest.mock('../src/services/FirebaseAuthService', () => ({
  FirebaseAuthService: {
    signInWithEmail: jest.fn(),
    signUpWithEmail: jest.fn(),
    signInWithGoogleWeb: jest.fn(),
  },
}));

jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    enterGuestMode: jest.fn(),
  }),
}));

describe('LoginScreen auth options', () => {
  const originalPlatformOs = Platform.OS;

  beforeEach(() => {
    mockConfig.googleWebClientId = undefined;
    mockConfig.googleIosClientId = undefined;
  });

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalPlatformOs,
    });
  });

  it('shows Google sign-in on web even when no Google client IDs are configured', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'web',
    });

    const LoginScreen = require('../src/screens/LoginScreen').default;
    const { getByText } = render(<LoginScreen />);

    expect(getByText('CONTINUE WITH GOOGLE')).toBeTruthy();
  });

  it('hides Google sign-in on native when no Google client IDs are configured', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'ios',
    });

    const LoginScreen = require('../src/screens/LoginScreen').default;
    const { queryByText } = render(<LoginScreen />);

    expect(queryByText('CONTINUE WITH GOOGLE')).toBeNull();
  });

  it('shows Google sign-in on native when a Google client ID is configured', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'ios',
    });
    mockConfig.googleWebClientId =
      'test-web-client-id.apps.googleusercontent.com';

    const LoginScreen = require('../src/screens/LoginScreen').default;
    const { getByText } = render(<LoginScreen />);

    expect(getByText('CONTINUE WITH GOOGLE')).toBeTruthy();
  });
});
