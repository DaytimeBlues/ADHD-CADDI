/**
 * Cosmic Radii
 *
 * Border radius tokens for the Cosmic theme.
 */

export const cosmicRadii = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 9999,
} as const;

export type CosmicRadii = keyof typeof cosmicRadii;
export type CosmicRadiiType = keyof typeof cosmicRadii;
