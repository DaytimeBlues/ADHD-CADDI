/**
 * Capture Bubble Styles
 *
 * StyleSheet definitions for the CaptureBubble component.
 */

import { StyleSheet } from 'react-native';
import { FAB_SIZE, BADGE_SIZE, COLORS } from './captureBubbleConstants';

export const captureBubbleStyles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 88, // above tab bar (60px) + padding
    right: 20,
    zIndex: 999,
    alignItems: 'flex-end',
  },
  hintPill: {
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.hintBg,
    borderWidth: 1,
    borderColor: COLORS.hintBorder,
    maxWidth: 168,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.hintText,
    letterSpacing: 0.3,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 26,
    color: COLORS.fabText,
    fontWeight: '300',
    lineHeight: 30,
    includeFontPadding: false,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: COLORS.badge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#070712', // obsidian border to separate from FAB
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.badgeText,
  },
});
