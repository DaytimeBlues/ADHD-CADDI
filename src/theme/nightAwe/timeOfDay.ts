import {
  constellationColors,
  featureColors,
  horizonColors,
  skyColors,
  starColors,
} from './semantic';

export type NightAwePhase = 'predawn' | 'sunrise' | 'day' | 'sunset' | 'night';

export interface NightAwePalette {
  phase: NightAwePhase;
  sky: readonly [string, string, string];
  horizon: typeof horizonColors;
  stars: typeof starColors;
  constellation: typeof constellationColors;
  features: typeof featureColors;
}

export function getNightAwePhaseForHour(hour: number): NightAwePhase {
  if (hour >= 4 && hour < 6) {
    return 'predawn';
  }
  if (hour >= 6 && hour < 9) {
    return 'sunrise';
  }
  if (hour >= 9 && hour < 17) {
    return 'day';
  }
  if (hour >= 17 && hour < 20) {
    return 'sunset';
  }
  return 'night';
}

export function getNightAwePaletteForHour(hour: number): NightAwePalette {
  const phase = getNightAwePhaseForHour(hour);

  return {
    phase,
    sky: skyColors[phase],
    horizon: horizonColors,
    stars: starColors,
    constellation: constellationColors,
    features: featureColors,
  };
}

export function getCurrentNightAwePalette(date = new Date()): NightAwePalette {
  return getNightAwePaletteForHour(date.getHours());
}
