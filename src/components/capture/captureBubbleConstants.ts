/**
 * Capture Bubble Constants
 *
 * Size constants, durations, and color palette for the CaptureBubble component.
 */

export const FAB_SIZE = 60;
export const BADGE_SIZE = 22;
export const PULSE_DURATION = 900;
export const SPIN_DURATION = 1200;

// Cosmic colors (no hex outside tokens in app code - these mirror cosmicTokens)
export const COLORS = {
  idle: '#8B5CF6', // nebulaViolet
  recording: '#2DD4BF', // auroraTeal
  processing: '#8B5CF6', // nebulaViolet
  failed: '#FB7185', // cometRose
  offline: '#6B7A9C', // neutral.medium (muted)
  needsCheckin: '#F6C177', // gold
  badge: '#FB7185', // cometRose
  badgeText: '#EEF2FF', // starlight
  fabText: '#EEF2FF', // starlight
  hintBg: 'rgba(7, 7, 18, 0.84)',
  hintBorder: 'rgba(185, 194, 217, 0.18)',
  hintText: '#EEF2FF',
} as const;
