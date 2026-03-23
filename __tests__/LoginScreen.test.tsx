import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';

const mockEnterGuestMode = jest.fn();
const mockSignInWithGoogleWeb = jest.fn();

jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    enterGuestMode: (...args: unknown[]) => mockEnterGuestMode(...args),
  }),
}));

jest.mock('../src/services/FirebaseAuthService', () => ({
  FirebaseAuthService: {
    signInWithEmail: jest.fn(),
    signUpWithEmail: jest.fn(),
    signInWithGoogleWeb: (...args: unknown[]) => mockSignInWithGoogleWeb(...args),
  },
}));

jest.mock('../src/config', () => ({
  config: {
    googleWebClientId: 'google-web-client-id',
    googleIosClientId: undefined,
  },
}));

jest.mock('../src/components/AppIcon', () => 'AppIcon');
jest.mock('../src/ui/cosmic', () => ({
  GlowCard: ({ children }: { children: React.ReactNode }) => children,
}));

describe('LoginScreen guest entry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnterGuestMode.mockResolvedValue(undefined);
  });

  it('enters guest mode without calling a Firebase sign-in provider', async () => {
    render(<LoginScreen />);

    fireEvent.press(screen.getByTestId('login-guest-button'));

    expect(mockEnterGuestMode).toHaveBeenCalledTimes(1);
    expect(mockSignInWithGoogleWeb).not.toHaveBeenCalled();
  });
});
