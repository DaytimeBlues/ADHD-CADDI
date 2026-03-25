const mockInitializeApp = jest.fn(() => 'firebase-app');
const mockInitializeAuth = jest.fn(() => 'firebase-auth');
const browserLocalPersistence = { kind: 'browserLocalPersistence' };
const browserPopupRedirectResolver = {
  kind: 'browserPopupRedirectResolver',
};

const mockGoogleProvider = {
  addScope: jest.fn(),
  setCustomParameters: jest.fn(),
};

jest.mock('@firebase/app', () => ({
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
  initializeApp: (...args: unknown[]) => mockInitializeApp(...args),
}));

jest.mock('@firebase/auth', () => ({
  initializeAuth: (...args: unknown[]) => mockInitializeAuth(...args),
  GoogleAuthProvider: jest.fn(() => mockGoogleProvider),
  EmailAuthProvider: jest.fn(),
  browserLocalPersistence,
  browserPopupRedirectResolver,
}));

describe('firebase.web auth bootstrap', () => {
  beforeEach(() => {
    jest.resetModules();
    mockInitializeApp.mockClear();
    mockInitializeAuth.mockClear();
    mockGoogleProvider.addScope.mockClear();
    mockGoogleProvider.setCustomParameters.mockClear();
  });

  it('configures popup auth dependencies for hosted Google sign-in', () => {
    require('../src/services/firebase.web');

    expect(mockInitializeAuth).toHaveBeenCalledWith(
      'firebase-app',
      expect.objectContaining({
        persistence: browserLocalPersistence,
        popupRedirectResolver: browserPopupRedirectResolver,
      }),
    );
  });
});
