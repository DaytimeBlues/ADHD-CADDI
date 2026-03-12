import { StyleSheet } from 'react-native';
import { Tokens } from '../theme/tokens';
import type { ThemeTokens } from '../theme/types';
import type { ThemeVariant } from '../theme/themeVariant';
import { isWeb } from '../utils/PlatformUtils';

export const getStyles = (variant: ThemeVariant, t: ThemeTokens) => {
  const isCosmic = variant === 'cosmic';
  const isNightAwe = variant === 'nightAwe';

  const textPrimary = isNightAwe
    ? t.colors.text?.primary || Tokens.colors.text.primary
    : isCosmic
      ? '#EEF2FF'
      : Tokens.colors.text.primary;
  const textSecondary = isNightAwe
    ? t.colors.text?.secondary || Tokens.colors.text.secondary
    : isCosmic
      ? 'rgba(185, 194, 217, 0.8)'
      : Tokens.colors.text.secondary;
  const textMuted = isNightAwe
    ? t.colors.text?.muted || Tokens.colors.text.tertiary
    : isCosmic
      ? 'rgba(185, 194, 217, 0.6)'
      : Tokens.colors.text.tertiary;
  const borderSubtle = isNightAwe
    ? t.colors.utility?.border || Tokens.colors.neutral.borderSubtle
    : isCosmic
      ? 'rgba(185, 194, 217, 0.08)'
      : Tokens.colors.neutral.dark;
  const surfaceBase = isNightAwe
    ? t.colors.nightAwe?.surface?.raised || Tokens.colors.neutral.darker
    : isCosmic
      ? 'rgba(14, 20, 40, 0.8)'
      : Tokens.colors.neutral.darker;
  const surfaceBorder = isNightAwe
    ? t.colors.nightAwe?.surface?.border || Tokens.colors.neutral.border
    : isCosmic
      ? 'rgba(185, 194, 217, 0.12)'
      : Tokens.colors.neutral.border;
  const brandAccent = isNightAwe
    ? t.colors.nightAwe?.feature?.home || Tokens.colors.brand[500]
    : isCosmic
      ? '#8B5CF6'
      : Tokens.colors.brand[500];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    scrollContent: {
      flexGrow: 1,
      padding: Tokens.spacing[4],
      alignItems: 'center',
    },
    maxWidthWrapper: {
      width: '100%',
      maxWidth: 960,
    },
    header: {
      marginBottom: Tokens.spacing[8],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingTop: Tokens.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: borderSubtle,
      paddingBottom: Tokens.spacing[6],
    },
    title: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xl,
      fontWeight: '700',
      color: textPrimary,
      letterSpacing: -1,
      ...((isCosmic || isNightAwe) && isWeb
        ? {
            textShadow: isNightAwe
              ? '0 0 18px rgba(217, 228, 242, 0.12)'
              : '0 0 20px rgba(139, 92, 246, 0.3)',
          }
        : {}),
    },
    systemStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    systemStatusText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: 10,
      color: textMuted,
      marginRight: 6,
      letterSpacing: 1.5,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: isNightAwe
        ? t.colors.semantic.success
        : isCosmic
          ? '#2DD4BF'
          : Tokens.colors.success.main,
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: surfaceBase,
      paddingHorizontal: Tokens.spacing[3],
      paddingVertical: 4,
      borderRadius: isCosmic || isNightAwe ? 12 : Tokens.radii.none,
      borderWidth: 1,
      borderColor: surfaceBorder,
    },
    streakText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      fontWeight: '700',
      color: brandAccent,
      letterSpacing: 1,
    },
    activationCard: {
      marginBottom: Tokens.spacing[6],
    },
    activationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Tokens.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: borderSubtle,
      paddingBottom: Tokens.spacing[2],
    },
    activationTitle: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      color: textSecondary,
      letterSpacing: 1,
    },
    activationRate: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.lg,
      fontWeight: '700',
      color: textPrimary,
    },
    activationGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statBox: {
      flex: 1,
    },
    statLabel: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: 10,
      color: textMuted,
      marginBottom: 2,
      letterSpacing: 0.5,
    },
    statValue: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.base,
      color: textPrimary,
      fontWeight: '700',
    },
    textSuccess: {
      color: isNightAwe
        ? t.colors.semantic.success
        : isCosmic
          ? '#2DD4BF'
          : Tokens.colors.success.main,
    },
    textError: {
      color: isNightAwe
        ? t.colors.semantic.error
        : isCosmic
          ? '#FB7185'
          : Tokens.colors.error.main,
    },
    textNeutral: {
      color: isNightAwe
        ? t.colors.text?.secondary || Tokens.colors.text.secondary
        : isCosmic
          ? '#B9C2D9'
          : Tokens.colors.text.secondary,
    },
    overlayCard: {
      marginBottom: Tokens.spacing[6],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    overlayCardActive: {},
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Tokens.spacing[3],
    },
    settingsButton: {
      width: 32,
      height: 32,
      borderRadius: isCosmic || isNightAwe ? 8 : 0,
      backgroundColor: surfaceBase,
      borderWidth: 1,
      borderColor: surfaceBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsButtonText: {
      fontSize: 18,
      color: textSecondary,
      marginTop: isWeb ? -2 : 0,
    },
    overlayTextGroup: {
      flex: 1,
    },
    overlayTitle: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      fontWeight: '700',
      color: textPrimary,
      letterSpacing: 1,
    },
    overlayStatus: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: 10,
      color: textMuted,
      marginTop: 2,
      letterSpacing: 0.5,
    },
    overlayStatusActive: {
      color: isNightAwe
        ? t.colors.semantic.success
        : isCosmic
          ? '#2DD4BF'
          : Tokens.colors.success.main,
    },
    modesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: Tokens.spacing[3],
    },
    debugPanel: {
      marginBottom: Tokens.spacing[6],
      padding: Tokens.spacing[3],
      backgroundColor: surfaceBase,
      borderWidth: 1,
      borderColor: surfaceBorder,
      borderStyle: 'dashed',
      borderRadius: isCosmic || isNightAwe ? 12 : 0,
    },
    debugTitle: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: 10,
      color: textMuted,
      marginBottom: Tokens.spacing[2],
      textTransform: 'uppercase',
    },
    debugText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: 10,
      color: textMuted,
      marginBottom: 2,
    },
    debugButtonRow: {
      flexDirection: 'row',
      gap: Tokens.spacing[2],
      marginTop: Tokens.spacing[2],
    },
    debugButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: surfaceBase,
      borderWidth: 1,
      borderColor: surfaceBorder,
      borderRadius: isCosmic || isNightAwe ? 6 : 0,
    },
    debugButtonText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: 10,
      fontWeight: '700',
      color: textPrimary,
    },
    negativeMarginTop24: {
      marginTop: -24,
    },
    zIndex10: {
      zIndex: 10,
    },
  });
};
