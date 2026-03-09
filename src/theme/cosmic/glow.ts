/**
 * Cosmic Glow Definitions
 *
 * Glow/shadow definitions for the Cosmic theme.
 */

import { Platform } from 'react-native';
import { cosmicColors } from './colors';

export type GlowLevel = 'none' | 'soft' | 'medium' | 'strong';

/**
 * Web-specific box shadows per research spec
 * Multi-layer composition for depth
 */
export const webBoxShadows = {
  none: 'none',
  soft: '0 0 0 1px rgba(139, 92, 246, 0.18), 0 10px 24px rgba(7, 7, 18, 0.55)',
  medium:
    '0 0 0 1px rgba(139, 92, 246, 0.28), 0 0 26px rgba(139, 92, 246, 0.22), 0 14px 30px rgba(7, 7, 18, 0.55)',
  strong:
    '0 0 0 1px rgba(45, 212, 191, 0.34), 0 0 34px rgba(45, 212, 191, 0.26), 0 0 70px rgba(139, 92, 246, 0.18), 0 18px 44px rgba(7, 7, 18, 0.62)',
} as const;

/**
 * Native shadow styles per research spec
 */
export const glowStyles = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  soft: {
    shadowColor: cosmicColors.nebulaViolet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: cosmicColors.nebulaViolet,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 4,
  },
  strong: {
    shadowColor: cosmicColors.auroraTeal, // Teal tint for strong glow per spec
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 6,
  },
} as const;

// Web-specific text shadow styles for glows
export const textGlowStyles = {
  none: undefined,
  soft: Platform.select({
    web: {
      textShadow: '0 0 18px rgba(139, 92, 246, 0.28)',
    },
    default: undefined,
  }),
  medium: Platform.select({
    web: {
      textShadow:
        '0 0 24px rgba(139, 92, 246, 0.40), 0 0 48px rgba(139, 92, 246, 0.20)',
    },
    default: undefined,
  }),
  strong: Platform.select({
    web: {
      textShadow:
        '0 0 32px rgba(45, 212, 191, 0.50), 0 0 64px rgba(139, 92, 246, 0.30)',
    },
    default: undefined,
  }),
} as const;
