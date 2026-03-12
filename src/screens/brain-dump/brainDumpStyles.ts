/**
 * Brain Dump Styles
 *
 * StyleSheet definitions for the BrainDumpScreen component.
 */

import { StyleSheet } from 'react-native';
import type { ThemeTokens } from '../../theme/types';
import type { ThemeVariant } from '../../theme/themeVariant';
import { Tokens } from '../../theme/tokens';

const LIST_PADDING_BOTTOM = 120;
const HEADER_LETTER_SPACING = 2;
const SUBHEADER_LETTER_SPACING = 1;
const EMPTY_STATE_OPACITY = 0.3;
const ITEM_VERTICAL_PADDING = 4;
const BADGE_HORIZONTAL_PADDING = 6;
const BADGE_MIN_WIDTH = 40;
const CATEGORY_TITLE_HORIZONTAL_PADDING = 8;
const CATEGORY_TITLE_VERTICAL_PADDING = 4;
const CATEGORY_TITLE_BORDER_RADIUS = 4;

export const getBrainDumpStyles = (variant: ThemeVariant, t: ThemeTokens) => {
  const isCosmic = variant === 'cosmic';
  const isNightAwe = variant === 'nightAwe';
  const textPrimary = isNightAwe
    ? t.colors.text?.primary || Tokens.colors.text.primary
    : isCosmic
      ? t.colors.cosmic?.starlight || '#EEF2FF'
      : t.colors.text?.primary || Tokens.colors.text.primary;
  const textSecondary = isNightAwe
    ? t.colors.text?.secondary || Tokens.colors.text.secondary
    : isCosmic
      ? t.colors.cosmic?.mist || '#B9C2D9'
      : t.colors.text?.secondary || Tokens.colors.text.secondary;
  const textMuted = isNightAwe
    ? t.colors.text?.muted || Tokens.colors.text.tertiary
    : t.colors.text?.secondary || Tokens.colors.text.secondary;
  const accent = isNightAwe
    ? t.colors.nightAwe?.feature?.brainDump || t.colors.semantic.primary
    : isCosmic
      ? t.colors.cosmic?.nebulaViolet || '#8B5CF6'
      : t.colors.brand[500];
  const surfaceBase = isNightAwe
    ? t.colors.nightAwe?.surface?.base || 'rgba(8, 17, 30, 0.68)'
    : isCosmic
      ? 'rgba(11, 16, 34, 0.74)'
      : t.colors.neutral.dark;
  const borderSubtle = isNightAwe
    ? t.colors.nightAwe?.surface?.border || 'rgba(217, 228, 242, 0.14)'
    : isCosmic
      ? 'rgba(139, 92, 246, 0.24)'
      : t.colors.neutral.border;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        variant === 'linear' ? t.colors.neutral.darkest : 'transparent',
    },
    centerContainer: {
      flex: 1,
      alignItems: 'center',
      zIndex: 1,
    },
    contentWrapper: {
      flex: 1,
      width: '100%',
      maxWidth: t.layout?.maxWidth?.content || 960,
      paddingHorizontal: t.spacing[4],
      paddingTop: t.spacing[2],
      paddingBottom: t.spacing[4],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: isCosmic ? 16 : t.spacing[5],
      marginTop: t.spacing[4],
    },
    title: {
      fontFamily:
        t.type?.fontFamily?.mono ||
        t.typography?.mono?.fontFamily ||
        'monospace',
      fontSize: t.type?.sm || t.fontSizes?.[14] || 14,
      color: textPrimary,
      fontWeight: '700',
      letterSpacing: HEADER_LETTER_SPACING,
    },
    headerLine: {
      flex: 1,
      height: 1,
      backgroundColor: borderSubtle,
      marginLeft: t.spacing[4],
    },
    tourButton: {
      borderWidth: 1,
      borderColor: borderSubtle,
      backgroundColor: surfaceBase,
      paddingHorizontal: t.spacing[3],
      paddingVertical: t.spacing[2],
      borderRadius: isCosmic ? 999 : isNightAwe ? 12 : t.radii.md,
      marginLeft: t.spacing[3],
    },
    tourButtonPressed: {
      opacity: 0.82,
    },
    tourButtonText: {
      fontFamily:
        t.type?.fontFamily?.mono ||
        t.typography?.mono?.fontFamily ||
        'monospace',
      fontSize: t.type?.xs || t.fontSizes?.[12] || 12,
      color: accent,
      fontWeight: '700',
      letterSpacing: SUBHEADER_LETTER_SPACING,
    },
    tutorialOverlay: {
      marginBottom: t.spacing[4],
      zIndex: 2,
    },
    loadingContainer: {
      padding: t.spacing[8],
      alignItems: 'center',
      gap: t.spacing[4],
    },
    loadingText: {
      fontFamily:
        t.type?.fontFamily?.mono ||
        t.typography?.mono?.fontFamily ||
        'monospace',
      fontSize: t.type?.sm || t.fontSizes?.[14] || 14,
      color: textSecondary,
      letterSpacing: SUBHEADER_LETTER_SPACING,
      textTransform: 'uppercase',
    },
    errorContainer: {
      marginTop: t.spacing[2],
      marginBottom: t.spacing[4],
      alignItems: 'center',
    },
    errorText: {
      fontFamily:
        t.type?.fontFamily?.mono ||
        t.typography?.mono?.fontFamily ||
        'monospace',
      fontSize: t.type?.xs || t.fontSizes?.[12] || 12,
      color: accent,
      textAlign: 'center',
    },
    connectButton: {
      marginTop: t.spacing[3],
      backgroundColor: accent,
      paddingHorizontal: t.spacing[4],
      paddingVertical: t.spacing[2],
      borderRadius: isNightAwe ? 10 : t.radii.md,
      borderWidth: 1,
      borderColor: accent,
    },
    connectButtonPressed: {
      opacity: 0.8,
    },
    connectButtonDisabled: {
      opacity: 0.6,
    },
    connectButtonText: {
      fontFamily:
        t.type?.fontFamily?.mono ||
        t.typography?.mono?.fontFamily ||
        'monospace',
      fontSize: t.type?.xs || t.fontSizes?.[12] || 12,
      color: t.colors.text?.onAccent || '#08111E',
      fontWeight: '700',
    },
    emptyState: {
      marginTop: t.spacing[12],
      opacity: EMPTY_STATE_OPACITY,
    },
    listContent: {
      paddingBottom: LIST_PADDING_BOTTOM,
    },
    sortedSection: {
      marginTop: t.spacing[6],
      paddingTop: t.spacing[4],
      borderTopWidth: 1,
      borderTopColor: borderSubtle,
    },
    sortedHeader: {
      fontFamily:
        t.type?.fontFamily?.mono ||
        t.typography?.mono?.fontFamily ||
        'monospace',
      fontSize: t.type?.sm || t.fontSizes?.[14] || 14,
      color: accent,
      marginBottom: t.spacing[4],
      letterSpacing: SUBHEADER_LETTER_SPACING,
    },
    categorySection: {
      marginBottom: t.spacing[4],
    },
    categoryTitle: {
      fontFamily:
        t.type?.fontFamily?.mono ||
        t.typography?.mono?.fontFamily ||
        'monospace',
      fontSize: t.type?.xs || t.fontSizes?.[12] || 12,
      fontWeight: '700',
      color: textPrimary,
      textTransform: 'uppercase',
      marginBottom: t.spacing[2],
      backgroundColor: surfaceBase,
      paddingHorizontal: CATEGORY_TITLE_HORIZONTAL_PADDING,
      paddingVertical: CATEGORY_TITLE_VERTICAL_PADDING,
      borderRadius: isNightAwe ? 8 : CATEGORY_TITLE_BORDER_RADIUS,
      alignSelf: 'flex-start',
      borderWidth: isNightAwe ? 1 : 0,
      borderColor: borderSubtle,
    },
    sortedItemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingVertical: ITEM_VERTICAL_PADDING,
      marginBottom: 0,
    },
    sortedItemText: {
      flex: 1,
      fontFamily:
        t.type?.fontFamily?.mono ||
        t.typography?.mono?.fontFamily ||
        'monospace',
      fontSize: t.type?.xs || t.fontSizes?.[12] || 12,
      color: textSecondary,
      lineHeight: (t.type?.sm || 14) * 1.5,
      marginRight: t.spacing[3],
    },
    priorityBadge: {
      paddingHorizontal: BADGE_HORIZONTAL_PADDING,
      paddingVertical: 0,
      borderRadius: isCosmic ? 4 : isNightAwe ? 8 : t.radii.none,
      minWidth: BADGE_MIN_WIDTH,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: borderSubtle,
      backgroundColor: isNightAwe ? surfaceBase : 'transparent',
    },
    priorityText: {
      fontFamily:
        t.type?.fontFamily?.mono ||
        t.typography?.mono?.fontFamily ||
        'monospace',
      fontSize: t.fontSizes?.[10] || 10,
      fontWeight: '700',
      textTransform: 'uppercase',
      color: textPrimary,
    },
  });
};
