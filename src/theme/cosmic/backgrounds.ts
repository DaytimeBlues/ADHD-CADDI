/**
 * Cosmic Backgrounds
 *
 * Background variant styles for the Cosmic theme.
 */

import { Platform } from 'react-native';
import { cosmicColors } from './colors';

export type BackgroundVariant = 'ridge' | 'nebula' | 'moon';

type BackgroundStyle = {
  background?: string;
  backgroundColor?: string;
};

export const backgroundStyles: Record<
  BackgroundVariant,
  BackgroundStyle | undefined
> = {
  ridge: Platform.select({
    web: {
      background: `
        linear-gradient(180deg, 
          ${cosmicColors.obsidian} 0%, 
          ${cosmicColors.midnight} 40%, 
          ${cosmicColors.deepSpace} 100%
        )
      `,
    },
    default: {
      backgroundColor: cosmicColors.obsidian,
    },
  }),
  nebula: Platform.select({
    web: {
      background: `
        radial-gradient(ellipse at center top, 
          ${cosmicColors.deepSpace} 0%, 
          ${cosmicColors.midnight} 50%, 
          ${cosmicColors.obsidian} 100%
        )
      `,
    },
    default: {
      backgroundColor: cosmicColors.obsidian,
    },
  }),
  moon: Platform.select({
    web: {
      background: `
        radial-gradient(ellipse at center 30%, 
          ${cosmicColors.midnight} 0%, 
          ${cosmicColors.obsidian} 70%
        )
      `,
    },
    default: {
      backgroundColor: cosmicColors.obsidian,
    },
  }),
};

// Dimmer overlay for focus screens
export const dimmerOverlay = Platform.select({
  web: {
    background: `${cosmicColors.obsidian}80`, // 50% overlay
  },
  default: {
    backgroundColor: `${cosmicColors.obsidian}80`,
  },
});
