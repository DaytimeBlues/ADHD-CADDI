import { Platform, StyleSheet } from 'react-native';
import { Tokens } from '../theme/tokens';

export const getFogCutterScreenStyles = (isCosmic: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isCosmic ? 'transparent' : Tokens.colors.neutral.darkest,
    },
    scrollContent: {
      flex: 1,
      alignItems: 'center',
    },
    content: {
      flex: 1,
      width: '100%',
      maxWidth: Tokens.layout.maxWidth.prose,
      padding: Tokens.spacing[4],
    },
    header: {
      marginBottom: Tokens.spacing[6],
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingBottom: Tokens.spacing[2],
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.lg,
      fontWeight: '700',
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    headerLine: {
      flex: 1,
      height: 1,
      backgroundColor: isCosmic ? '#0B1022' : Tokens.colors.neutral.dark,
      marginLeft: Tokens.spacing[4],
    },
    rationaleCard: {
      marginBottom: Tokens.spacing[4],
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
    creationCard: {
      marginBottom: Tokens.spacing[6],
    },
    creationHeader: {
      marginBottom: Tokens.spacing[4],
    },
    cardTitle: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      fontWeight: '700',
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.secondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    inputGroup: {
      marginBottom: Tokens.spacing[4],
    },
    aiButtonContainer: {
      alignItems: 'flex-end',
    },
    input: {
      backgroundColor: isCosmic ? '#0B1022' : Tokens.colors.neutral.darker,
      borderRadius: isCosmic ? 8 : 0,
      paddingHorizontal: Tokens.spacing[3],
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.sm,
      marginBottom: Tokens.spacing[3],
      height: 48,
      borderWidth: 1,
      borderColor: isCosmic
        ? 'rgba(42, 53, 82, 0.3)'
        : Tokens.colors.neutral.border,
      ...Platform.select({
        web: { outlineStyle: 'none', transition: 'border-color 0.2s ease' },
      }),
    },
    marginBottom8: {
      marginBottom: 8,
    },
    inputFocused: {
      borderColor: isCosmic ? '#8B5CF6' : Tokens.colors.brand[500],
      backgroundColor: isCosmic ? '#111A33' : Tokens.colors.neutral.darkest,
      ...Platform.select({
        web: isCosmic
          ? {
              boxShadow:
                '0 0 0 2px rgba(139,92,246,0.3), 0 0 30px rgba(139,92,246,0.25)',
            }
          : {},
      }),
    },
    addStepRow: {
      flexDirection: 'row',
      marginBottom: Tokens.spacing[3],
      gap: Tokens.spacing[2],
    },
    stepInput: {
      flex: 1,
      backgroundColor: isCosmic ? '#0B1022' : Tokens.colors.neutral.darker,
      borderRadius: isCosmic ? 8 : 0,
      paddingHorizontal: Tokens.spacing[3],
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.sm,
      height: 48,
      borderWidth: 1,
      borderColor: isCosmic
        ? 'rgba(42, 53, 82, 0.3)'
        : Tokens.colors.neutral.border,
      ...Platform.select({
        web: { outlineStyle: 'none', transition: 'border-color 0.2s ease' },
      }),
    },
    addButton: {
      width: 48,
      height: 48,
      paddingHorizontal: 0,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: isCosmic ? 8 : 0,
    },
    previewContainer: {
      backgroundColor: isCosmic ? '#111A33' : Tokens.colors.neutral.darkest,
      borderRadius: isCosmic ? 8 : 0,
      padding: Tokens.spacing[4],
      marginBottom: Tokens.spacing[3],
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: isCosmic
        ? 'rgba(42, 53, 82, 0.3)'
        : Tokens.colors.neutral.border,
    },
    previewTitle: {
      fontFamily: Tokens.type.fontFamily.mono,
      color: Tokens.colors.text.tertiary,
      fontSize: Tokens.type.xxs,
      fontWeight: '700',
      marginBottom: Tokens.spacing[2],
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    microStep: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 2,
    },
    stepNumber: {
      color: Tokens.colors.text.tertiary,
      width: Tokens.spacing[6],
      fontSize: Tokens.type.xs,
      fontWeight: 'bold',
      marginRight: Tokens.spacing[2],
      fontFamily: Tokens.type.fontFamily.mono,
    },
    stepText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.sm,
    },
    shimmer: {
      marginTop: Tokens.spacing[2],
    },
    saveButton: {
      marginTop: Tokens.spacing[2],
    },
    divider: {
      height: 1,
      backgroundColor: isCosmic
        ? 'rgba(42, 53, 82, 0.3)'
        : Tokens.colors.neutral.border,
      width: '100%',
      marginBottom: Tokens.spacing[6],
    },
    sectionHeader: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      fontWeight: '700',
      color: Tokens.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: Tokens.spacing[3],
    },
    taskList: {
      flex: 1,
    },
    listContent: {
      paddingBottom: Tokens.spacing[20],
    },
    taskCard: {
      backgroundColor: isCosmic ? '#111A33' : Tokens.colors.neutral.darkest,
      borderRadius: isCosmic ? 12 : 0,
      padding: Tokens.spacing[4],
      marginBottom: Tokens.spacing[2],
      borderWidth: 1,
      borderColor: isCosmic
        ? 'rgba(42, 53, 82, 0.3)'
        : Tokens.colors.neutral.border,
      minHeight: 64,
      justifyContent: 'center',
      ...Platform.select({
        web: {
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        },
      }),
    },
    taskCardHovered: {
      borderColor: isCosmic ? '#8B5CF6' : Tokens.colors.brand[500],
      zIndex: 1,
      ...Platform.select({
        web: isCosmic
          ? {
              boxShadow:
                '0 0 0 1px rgba(139,92,246,0.3), 0 0 20px rgba(139,92,246,0.2)',
            }
          : {},
      }),
    },
    taskCardPressed: {
      backgroundColor: isCosmic ? '#0B1022' : Tokens.colors.neutral.darker,
    },
    taskCardCompleted: {
      opacity: 0.5,
      backgroundColor: isCosmic ? '#111A33' : Tokens.colors.neutral.darker,
    },
    taskHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Tokens.spacing[1],
    },
    taskText: {
      fontFamily: Tokens.type.fontFamily.sans,
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
      fontSize: Tokens.type.base,
      fontWeight: '700',
      flex: 1,
      marginRight: Tokens.spacing[2],
    },
    completed: {
      textDecorationLine: 'line-through',
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.secondary,
    },
    doneBadge: {
      backgroundColor: isCosmic ? '#0B1022' : Tokens.colors.neutral.dark,
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.secondary,
      fontSize: Tokens.type.xxs,
      fontWeight: '700',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: isCosmic ? 8 : 0,
      overflow: 'hidden',
      fontFamily: Tokens.type.fontFamily.mono,
    },
    activeStepContainer: {
      marginTop: Tokens.spacing[2],
      paddingLeft: Tokens.spacing[2],
      borderLeftWidth: 1,
      borderLeftColor: isCosmic ? '#8B5CF6' : Tokens.colors.brand[500],
    },
    activeStepLabel: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xxs,
      color: Tokens.colors.text.tertiary,
      marginBottom: 1,
      letterSpacing: 0.5,
    },
    activeStepText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.secondary,
    },
    stepCountText: {
      fontFamily: Tokens.type.fontFamily.mono,
      color: Tokens.colors.text.tertiary,
      fontSize: Tokens.type.xs,
      letterSpacing: 1,
    },
    progressContainer: {
      marginTop: Tokens.spacing[2],
    },
    progressBar: {
      marginBottom: Tokens.spacing[2],
    },
    loadingContainer: {
      padding: Tokens.spacing[8],
      alignItems: 'center',
      gap: Tokens.spacing[4],
    },
    loadingText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.secondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    emptyState: {
      marginTop: Tokens.spacing[8],
      opacity: 0.5,
    },
    guideBanner: {
      backgroundColor: isCosmic ? '#0B1022' : Tokens.colors.neutral.dark,
      borderWidth: 1,
      borderColor: isCosmic ? '#8B5CF6' : Tokens.colors.brand[500],
      padding: Tokens.spacing[3],
      marginBottom: Tokens.spacing[6],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Tokens.spacing[4],
      borderRadius: isCosmic ? 12 : 0,
    },
    guideContent: {
      flex: 1,
    },
    guideTitle: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      fontWeight: '700',
      color: isCosmic ? '#8B5CF6' : Tokens.colors.brand[500],
      marginBottom: Tokens.spacing[1],
      letterSpacing: 1,
    },
    guideText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
    },
    guideButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: isCosmic
        ? 'rgba(42, 53, 82, 0.3)'
        : Tokens.colors.neutral.border,
      backgroundColor: isCosmic ? '#111A33' : Tokens.colors.neutral.darkest,
      borderRadius: isCosmic ? 8 : 0,
    },
    guideButtonPressed: {
      backgroundColor: isCosmic ? '#0B1022' : Tokens.colors.neutral.darker,
    },
    guideButtonText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xxs,
      fontWeight: '700',
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
      textTransform: 'uppercase',
    },
  });
