/**
 * Cosmic Semantic Colors
 *
 * Semantic color mappings for the Cosmic theme.
 */

import { cosmicColors } from './colors';

export const semanticColors = {
  primary: cosmicColors.nebulaViolet,
  secondary: cosmicColors.deepIndigo,
  success: cosmicColors.auroraTeal,
  warning: cosmicColors.starlightGold,
  error: cosmicColors.cometRose,
  info: cosmicColors.mist,
} as const;

/**
 * Neutral Scale (matches LinearTokens structure)
 */
export const neutralScale = {
  lightest: cosmicColors.starlight,
  lighter: '#D1D9F0',
  light: cosmicColors.mist,
  medium: '#6B7A9C',
  dark: cosmicColors.slate,
  darker: '#1A2540',
  darkest: cosmicColors.obsidian,
} as const;

/**
 * Brand Scale (violet spectrum matching nebulaViolet)
 */
export const brandScale = {
  50: '#F5F3FF',
  100: '#EDE9FE',
  200: '#DDD6FE',
  300: '#C4B5FD',
  400: '#A78BFA',
  500: cosmicColors.nebulaViolet,
  600: '#7C3AED',
  700: '#6D28D9',
  800: '#5B21B6',
  900: '#4C1D95',
} as const;

/**
 * Surface Colors (RGBA per research spec for depth)
 */
export const surfaceColors = {
  base: 'rgba(14, 20, 40, 0.78)',
  raised: 'rgba(18, 26, 52, 0.86)',
  sunken: 'rgba(10, 14, 30, 0.82)',
  border: 'rgba(185, 194, 217, 0.16)',
} as const;

/**
 * Text Colors (per research spec)
 */
export const textColors = {
  primary: '#EEF2FF',
  secondary: 'rgba(238, 242, 255, 0.78)',
  muted: 'rgba(238, 242, 255, 0.56)',
  onAccent: '#070712',
} as const;

/**
 * Utility Colors
 */
export const utilityColors = {
  border: `${cosmicColors.slate}4D`, // 30% opacity
  borderStrong: `${cosmicColors.slate}80`, // 50% opacity
  overlay: `${cosmicColors.obsidian}CC`, // 80% opacity
  scrim: `${cosmicColors.obsidian}99`, // 60% opacity
} as const;
