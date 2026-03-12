import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tokens } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { GlowCard } from '../../ui/cosmic';
import type { ThemeTokens } from '../../theme/types';
import type { ThemeVariant } from '../../theme/themeVariant';

export const BrainDumpRationale: React.FC = () => {
  const { isCosmic, t, variant } = useTheme();
  const styles = useMemo(() => getStyles(variant, t), [t, variant]);

  const title = <Text style={styles.rationaleTitle}>WHY THIS WORKS</Text>;
  const body = (
    <Text style={styles.rationaleText}>
      Cognitive offloading is essential for ADHD working memory. Externalizing
      thoughts reduces mental clutter and prevents thought chasing. CBT/CADDI
      uses this to create space for prioritization and prevent overwhelm from
      competing demands.
    </Text>
  );

  if (isCosmic) {
    return (
      <GlowCard style={styles.rationaleCard} testID="rationale-card">
        {title}
        {body}
      </GlowCard>
    );
  }

  return (
    <View style={styles.rationaleCard}>
      {title}
      {body}
    </View>
  );
};

const getStyles = (variant: ThemeVariant, t: ThemeTokens) => {
  const isCosmic = variant === 'cosmic';
  const isNightAwe = variant === 'nightAwe';
  const accent = isNightAwe
    ? t.colors.nightAwe?.feature?.brainDump || t.colors.semantic.primary
    : Tokens.colors.brand[500];
  const surface = isNightAwe
    ? t.colors.nightAwe?.surface?.raised || 'rgba(13, 24, 40, 0.74)'
    : isCosmic
      ? 'transparent'
      : Tokens.colors.neutral.darker;
  const borderColor = isNightAwe
    ? t.colors.nightAwe?.surface?.border || 'rgba(217, 228, 242, 0.14)'
    : isCosmic
      ? 'rgba(139, 92, 246, 0.2)'
      : Tokens.colors.neutral.border;

  return StyleSheet.create({
    rationaleCard: {
      backgroundColor: surface,
      padding: Tokens.spacing[3],
      borderRadius: isCosmic ? 12 : isNightAwe ? 16 : Tokens.radii.none,
      borderWidth: 1,
      borderColor,
      borderLeftWidth: isCosmic ? 1 : 2,
      borderLeftColor: accent,
      marginBottom: isCosmic ? 16 : Tokens.spacing[5],
    },
    rationaleTitle: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xxs,
      fontWeight: '700',
      color: accent,
      letterSpacing: 1,
      marginBottom: isCosmic ? 4 : Tokens.spacing[2],
      textTransform: 'uppercase',
    },
    rationaleText: {
      fontFamily: Tokens.type.fontFamily.body,
      fontSize: Tokens.type.xs,
      color: isNightAwe
        ? t.colors.text?.secondary || Tokens.colors.text.secondary
        : isCosmic
          ? '#B9C2D9'
          : Tokens.colors.text.secondary,
      lineHeight: 18,
      flexWrap: 'wrap',
    },
  });
};
