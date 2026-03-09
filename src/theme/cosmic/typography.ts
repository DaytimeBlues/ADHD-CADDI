/**
 * Cosmic Typography
 *
 * Typography tokens for the Cosmic theme.
 */

import { Platform } from 'react-native';

export const cosmicTypography = {
  heading: {
    fontFamily: Platform.select({
      web: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      ios: 'Inter-SemiBold',
      android: 'Inter-SemiBold',
      default: 'sans-serif',
    }),
    fontWeight: '600' as const,
    letterSpacing: -0.02,
  },
  body: {
    fontFamily: Platform.select({
      web: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      ios: 'Inter-Regular',
      android: 'Inter-Regular',
      default: 'sans-serif',
    }),
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  mono: {
    fontFamily: Platform.select({
      web: 'JetBrains Mono, Fira Code, monospace',
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  timer: {
    fontFamily: Platform.select({
      web: '"Space Grotesk", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      ios: 'Menlo', // Fallback on iOS
      android: 'monospace', // Fallback on Android
      default: 'monospace',
    }),
    fontWeight: '400' as const,
    letterSpacing: 0.8, // Per spec
  },
} as const;

// Per research spec: timer font sizes
export const cosmicTimerSizes = {
  xl: 64,
  lg: 48,
  md: 32,
} as const;

// Font size scale (matches LinearTokens structure)
export const cosmicFontSizes = {
  12: 12,
  14: 14,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  32: 32,
  48: 48,
  64: 64,
} as const;

// Line heights
export const cosmicLineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;
