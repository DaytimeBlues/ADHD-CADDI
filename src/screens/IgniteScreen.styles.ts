import { StyleSheet } from 'react-native';
import { Tokens } from '../theme/tokens';
import { isWeb } from '../utils/PlatformUtils';

export const getIgniteScreenStyles = (isCosmic: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    centerWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      width: '100%',
      maxWidth: Tokens.layout.maxWidth.prose,
      padding: Tokens.spacing[6],
      justifyContent: 'space-between',
      paddingVertical: Tokens.spacing[8],
    },
    restoringText: {
      marginTop: Tokens.spacing[4],
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.sm,
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.secondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    header: {
      alignItems: 'center',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderColor: isCosmic
        ? 'rgba(42, 53, 82, 0.3)'
        : Tokens.colors.neutral.dark,
      paddingBottom: Tokens.spacing[4],
    },
    title: {
      fontFamily: isCosmic ? 'Space Grotesk' : Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.lg,
      fontWeight: '700',
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      ...(isCosmic && isWeb
        ? {
            textShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
          }
        : {}),
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: isCosmic ? '#111A33' : Tokens.colors.neutral.darker,
      borderWidth: 1,
      borderColor: isCosmic
        ? 'rgba(139, 92, 246, 0.2)'
        : Tokens.colors.neutral.border,
      borderRadius: isCosmic ? 4 : 0,
      ...(isCosmic && isWeb
        ? {
            backdropFilter: 'blur(8px)',
            boxShadow:
              '0 0 0 1px rgba(139, 92, 246, 0.1), 0 4px 12px rgba(7, 7, 18, 0.3)',
          }
        : {}),
    },
    statusText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xxs,
      color: isCosmic ? '#8B5CF6' : Tokens.colors.brand[500],
      letterSpacing: 1,
    },
    timerCard: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    timerSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timerOverlay: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    timer: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: 140,
      fontWeight: '200',
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
      fontVariant: ['tabular-nums'],
      letterSpacing: -8,
      includeFontPadding: false,
    },
    controls: {
      width: '100%',
      maxWidth: 360,
      alignSelf: 'center',
      gap: Tokens.spacing[3],
    },
    mainButton: {
      width: '100%',
      borderRadius: isCosmic ? 8 : 0,
      height: 56,
    },
    secondaryControls: {
      flexDirection: 'row',
      gap: Tokens.spacing[3],
    },
    resetButton: {
      flex: 1,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: isCosmic
        ? 'rgba(185, 194, 217, 0.12)'
        : Tokens.colors.neutral.border,
      backgroundColor: isCosmic ? 'rgba(11, 16, 34, 0.5)' : 'transparent',
      borderRadius: isCosmic ? 4 : 0,
      ...(isCosmic && isWeb
        ? {
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }
        : {}),
    },
    resetButtonText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.secondary,
      letterSpacing: 1,
      fontWeight: '700',
    },
    soundButton: {
      flex: 1,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: isCosmic
        ? 'rgba(185, 194, 217, 0.12)'
        : Tokens.colors.neutral.border,
      backgroundColor: isCosmic
        ? 'rgba(11, 16, 34, 0.5)'
        : Tokens.colors.neutral.darker,
      borderRadius: isCosmic ? 4 : 0,
      ...(isCosmic && isWeb
        ? {
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }
        : {}),
    },
    soundButtonActive: {
      backgroundColor: isCosmic
        ? 'rgba(17, 26, 51, 0.8)'
        : Tokens.colors.neutral.dark,
      borderColor: isCosmic
        ? 'rgba(139, 92, 246, 0.4)'
        : Tokens.colors.brand[500],
      ...(isCosmic && isWeb
        ? {
            boxShadow:
              '0 0 0 1px rgba(139, 92, 246, 0.2), 0 0 16px rgba(139, 92, 246, 0.15)',
          }
        : {}),
    },
    soundButtonText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.secondary,
      letterSpacing: 1,
      fontWeight: '700',
    },
    textActive: {
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
    },
    buttonPressed: {
      opacity: 0.8,
      backgroundColor: isCosmic ? '#111A33' : Tokens.colors.neutral.dark,
    },
    rationaleCard: {
      marginTop: Tokens.spacing[4],
      marginBottom: Tokens.spacing[2],
    },
    rationaleTitle: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      fontWeight: '700',
      color: isCosmic ? '#8B5CF6' : Tokens.colors.brand[500],
      letterSpacing: 1,
      marginBottom: Tokens.spacing[2],
      textTransform: 'uppercase',
    },
    rationaleText: {
      fontFamily: Tokens.type.fontFamily.body,
      fontSize: Tokens.type.sm,
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.secondary,
      lineHeight: 22,
      flexWrap: 'wrap',
    },
  });
