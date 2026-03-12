import {
  getNightAwePhaseForHour,
  getNightAwePaletteForHour,
} from '../theme/nightAwe/timeOfDay';

describe('Night Awe time-of-day palette selection', () => {
  it('maps hours to the intended day phases', () => {
    expect(getNightAwePhaseForHour(4)).toBe('predawn');
    expect(getNightAwePhaseForHour(7)).toBe('sunrise');
    expect(getNightAwePhaseForHour(13)).toBe('day');
    expect(getNightAwePhaseForHour(18)).toBe('sunset');
    expect(getNightAwePhaseForHour(22)).toBe('night');
  });

  it('returns a complete palette for the active phase', () => {
    const palette = getNightAwePaletteForHour(22);

    expect(palette.phase).toBe('night');
    expect(palette.sky).toHaveLength(3);
    expect(palette.horizon.face).toBeDefined();
    expect(palette.constellation.active).toBeDefined();
  });
});
