describe('OAuthNativeAdapter', () => {
  const storage = {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => undefined),
    removeItem: jest.fn(async () => undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores only metadata for native google auth persistence', async () => {
    const { OAuthNativeAdapter } =
      require('../src/services/oauth/OAuthNativeAdapter') as typeof import('../src/services/oauth/OAuthNativeAdapter');
    const { STORAGE_KEYS } =
      require('../src/services/oauth/OAuthShared') as typeof import('../src/services/oauth/OAuthShared');
    const adapter = new OAuthNativeAdapter(storage);

    await (
      adapter as unknown as {
        storeAuthData: (
          provider: 'google',
          data: Record<string, unknown>,
        ) => Promise<void>;
      }
    ).storeAuthData('google', {
      accessToken: 'native-secret-token',
      expiresIn: 1800,
      email: 'native@example.com',
      name: 'Native User',
      picture: 'https://example.com/avatar.png',
    });

    expect(storage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.googleAuth,
      expect.any(String),
    );

    const stored = JSON.parse(storage.setItem.mock.calls[0][1] as string);
    expect(stored).toMatchObject({
      connected: true,
      email: 'native@example.com',
      name: 'Native User',
      picture: 'https://example.com/avatar.png',
    });
    expect(stored.accessToken).toBeUndefined();
    expect(stored.refreshToken).toBeUndefined();
  });
});
