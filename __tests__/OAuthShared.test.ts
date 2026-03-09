import {
  buildOAuthState,
  isOAuthStateExpired,
  sanitizeGoogleAuthData,
} from '../src/services/oauth/OAuthShared';

describe('OAuthShared', () => {
  it('builds oauth state with provider metadata', () => {
    const now = 1234567890;

    const result = buildOAuthState(
      'google',
      'state-1',
      'http://localhost',
      now,
    );

    expect(result).toEqual({
      provider: 'google',
      state: 'state-1',
      redirectUri: 'http://localhost',
      timestamp: now,
    });
  });

  it('treats oauth state as expired after ten minutes', () => {
    const now = 10 * 60 * 1000 + 1;

    expect(isOAuthStateExpired({ timestamp: 0 }, now)).toBe(true);
    expect(isOAuthStateExpired({ timestamp: 1 }, 10 * 60 * 1000)).toBe(false);
  });

  it('removes refresh token before persisting refreshed google auth', () => {
    const result = sanitizeGoogleAuthData({
      connected: true,
      accessToken: 'new-token',
      refreshToken: 'secret',
      expiresAt: 42,
      email: 'dev@example.com',
    });

    expect(result).toEqual({
      connected: true,
      accessToken: 'new-token',
      expiresAt: 42,
      email: 'dev@example.com',
    });
    expect('refreshToken' in result).toBe(false);
  });
});
