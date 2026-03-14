import { renderHook } from '@testing-library/react-native';
import { NightAweTokens, Tokens } from '../src/theme/tokens';
import { useHomeModes } from '../src/screens/home/useHomeModes';

describe('useHomeModes', () => {
  it('returns the expected home mode definitions for the linear theme', () => {
    const { result } = renderHook(() => useHomeModes('linear', Tokens));

    expect(result.current.map((mode) => mode.id)).toEqual([
      'resume',
      'ignite',
      'fogcutter',
      'pomodoro',
      'anchor',
      'checkin',
      'cbtguide',
    ]);
    expect(result.current.find((mode) => mode.id === 'pomodoro')?.accent).toBe(
      '#2DD4BF',
    );
  });

  it('returns night awe accents for themed modes', () => {
    const { result } = renderHook(() =>
      useHomeModes('nightAwe', NightAweTokens),
    );

    expect(result.current.find((mode) => mode.id === 'resume')?.accent).toBe(
      NightAweTokens.colors.nightAwe?.feature?.home,
    );
    expect(result.current.find((mode) => mode.id === 'ignite')?.accent).toBe(
      NightAweTokens.colors.nightAwe?.feature?.ignite,
    );
  });
});
