/**
 * Cosmic Colors
 *
 * Color palette for the Cosmic theme.
 */

export const cosmicColors = {
  // Neutrals - Deep space foundation
  obsidian: '#070712', // Deepest background
  midnight: '#0B1022', // Secondary background
  deepSpace: '#111A33', // Card surfaces
  slate: '#2A3552', // Borders, dividers
  mist: '#B9C2D9', // Secondary text
  starlight: '#EEF2FF', // Primary text

  // Accents - Ethereal glows
  nebulaViolet: '#8B5CF6', // Primary accent
  deepIndigo: '#243BFF', // Links, secondary actions
  auroraTeal: '#2DD4BF', // Success, breathing states, focus
  starlightGold: '#F6C177', // Warnings, calendar highlights
  cometRose: '#FB7185', // Errors, destructive actions
} as const;

export type CosmicColor = keyof typeof cosmicColors;
