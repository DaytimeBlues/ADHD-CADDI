import { useMemo } from 'react';
import type { ThemeTokens } from '../../theme/types';
import type { ThemeVariant } from '../../theme/themeVariant';
import { Tokens } from '../../theme/tokens';
import type { ModeCardMode } from '../ModeCard';

export type HomeMode = { id: string } & ModeCardMode;

export function useHomeModes(
  variant: ThemeVariant,
  t: ThemeTokens,
): HomeMode[] {
  const isNightAwe = variant === 'nightAwe';

  return useMemo<HomeMode[]>(
    () => [
      {
        id: 'resume',
        name: 'Resume',
        icon: 'play-circle',
        desc: 'CONTINUE',
        accent: isNightAwe
          ? t.colors.nightAwe?.feature?.home || t.colors.semantic.primary
          : '#8B5CF6',
      },
      {
        id: 'ignite',
        name: 'Ignite',
        icon: 'fire',
        desc: 'START TASKS',
        accent: isNightAwe
          ? t.colors.nightAwe?.feature?.ignite ||
            t.colors.semantic.secondary ||
            Tokens.colors.indigo.primary
          : '#8B5CF6',
      },
      {
        id: 'fogcutter',
        name: 'Fog Cutter',
        icon: 'weather-windy',
        desc: 'BREAK IT DOWN',
        accent: isNightAwe
          ? t.colors.nightAwe?.feature?.fogCutter || t.colors.semantic.primary
          : '#8B5CF6',
      },
      {
        id: 'pomodoro',
        name: 'Pomodoro',
        icon: 'timer-sand',
        desc: 'STAY ON TRACK',
        accent: isNightAwe ? t.colors.semantic.info : '#2DD4BF',
      },
      {
        id: 'anchor',
        name: 'Anchor',
        icon: 'anchor',
        desc: 'REGULATE',
        accent: isNightAwe
          ? t.colors.semantic.secondary || Tokens.colors.indigo.primary
          : '#243BFF',
      },
      {
        id: 'checkin',
        name: 'Check In',
        icon: 'chart-bar',
        desc: 'TRACK MOOD',
        accent: isNightAwe
          ? t.colors.nightAwe?.feature?.checkIn || t.colors.semantic.info
          : '#2DD4BF',
      },
      {
        id: 'cbtguide',
        name: 'CBT Guide',
        icon: 'brain',
        desc: 'LEARN',
        accent: isNightAwe ? t.colors.semantic.primary : '#8B5CF6',
      },
    ],
    [isNightAwe, t],
  );
}
