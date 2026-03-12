import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Tokens } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import type { ThemeTokens } from '../../theme/types';
import type { ThemeVariant } from '../../theme/themeVariant';

export interface BrainDumpGuideProps {
  showGuide: boolean;
  onDismiss: () => void;
}

export const BrainDumpGuide: React.FC<BrainDumpGuideProps> = ({
  showGuide,
  onDismiss,
}) => {
  const { t, variant } = useTheme();
  const styles = useMemo(() => getStyles(variant, t), [t, variant]);

  if (!showGuide) {
    return null;
  }

  return (
    <View style={styles.guideBanner}>
      <View style={styles.guideContent}>
        <Text style={styles.guideTitle}>DATA_CAPTURED.</Text>
        <Text style={styles.guideText}>NEXT: PROCESS_IN_FOG_CUTTER.</Text>
      </View>
      <Pressable
        onPress={onDismiss}
        style={({ pressed }: { pressed: boolean }) => [
          styles.guideButton,
          pressed && styles.guideButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Dismiss guidance"
      >
        <Text style={styles.guideButtonText}>ACK</Text>
      </Pressable>
    </View>
  );
};

const getStyles = (variant: ThemeVariant, t: ThemeTokens) => {
  const isCosmic = variant === 'cosmic';
  const isNightAwe = variant === 'nightAwe';
  const accent = isNightAwe
    ? t.colors.nightAwe?.feature?.brainDump || t.colors.semantic.primary
    : Tokens.colors.brand[500];
  const borderColor = isNightAwe
    ? t.colors.nightAwe?.surface?.border || 'rgba(217, 228, 242, 0.14)'
    : isCosmic
      ? 'rgba(139, 92, 246, 0.35)'
      : Tokens.colors.brand[500];

  return StyleSheet.create({
    guideBanner: {
      backgroundColor: isNightAwe
        ? t.colors.nightAwe?.surface?.base || 'rgba(8, 17, 30, 0.7)'
        : isCosmic
          ? 'rgba(17, 26, 51, 0.45)'
          : Tokens.colors.neutral.dark,
      borderWidth: 1,
      borderColor,
      borderRadius: isCosmic ? 10 : isNightAwe ? 14 : Tokens.radii.none,
      padding: isCosmic ? 10 : Tokens.spacing[3],
      marginBottom: isCosmic ? 16 : Tokens.spacing[5],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: isCosmic ? 8 : Tokens.spacing[3],
    },
    guideContent: {
      flex: 1,
    },
    guideTitle: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xxs,
      fontWeight: '700',
      color: accent,
      marginBottom: isCosmic ? 2 : Tokens.spacing[1],
      letterSpacing: 1,
    },
    guideText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xxs,
      lineHeight: 14,
      color: isNightAwe
        ? t.colors.text?.secondary || Tokens.colors.text.secondary
        : isCosmic
          ? '#B9C2D9'
          : Tokens.colors.text.primary,
    },
    guideButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor,
      backgroundColor: isNightAwe
        ? t.colors.nightAwe?.surface?.raised || 'rgba(13, 24, 40, 0.76)'
        : isCosmic
          ? 'rgba(17, 26, 51, 0.6)'
          : Tokens.colors.neutral.darkest,
      borderRadius: isCosmic ? 8 : isNightAwe ? 10 : Tokens.radii.none,
    },
    guideButtonPressed: {
      backgroundColor: Tokens.colors.neutral.darker,
    },
    guideButtonText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xxs,
      fontWeight: '700',
      color: isNightAwe
        ? t.colors.text?.primary || Tokens.colors.text.primary
        : isCosmic
          ? '#EEF2FF'
          : Tokens.colors.text.primary,
      textTransform: 'uppercase',
    },
  });
};
