import { normalizeThemeStoreState } from '../src/store/useThemeStore';

describe('useThemeStore theme normalization', () => {
  it('migrates legacy metro variants to linear during rehydration', () => {
    expect(
      normalizeThemeStoreState({
        variant: 'metro' as never,
      }),
    ).toEqual(
      expect.objectContaining({
        variant: 'linear',
      }),
    );
  });

  it('falls back to the default variant for invalid persisted values', () => {
    expect(
      normalizeThemeStoreState({
        variant: 'invalid-theme' as never,
      }),
    ).toEqual(
      expect.objectContaining({
        variant: 'cosmic',
      }),
    );
  });
});
