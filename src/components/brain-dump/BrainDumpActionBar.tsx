import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Tokens } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import type { ThemeTokens } from '../../theme/types';
import type { ThemeVariant } from '../../theme/themeVariant';

type PressableState = {
  pressed: boolean;
  hovered?: boolean;
};

export interface BrainDumpActionBarProps {
  itemCount: number;
  isSorting: boolean;
  onSort: () => void;
  onClear: () => void;
}

export const BrainDumpActionBar: React.FC<BrainDumpActionBarProps> = ({
  itemCount,
  isSorting,
  onSort,
  onClear,
}) => {
  const { t, variant } = useTheme();
  const styles = useMemo(() => getStyles(variant, t), [t, variant]);

  if (itemCount === 0) {
    return null;
  }

  return (
    <View style={styles.actionsBar}>
      <Text style={styles.countText}>{itemCount} ITEMS</Text>
      <View style={styles.actionsRight}>
        <Pressable
          testID="brain-dump-ai-sort"
          onPress={onSort}
          disabled={isSorting}
          accessibilityRole="button"
          accessibilityLabel="AI sort"
          accessibilityHint="Sorts and groups items using AI suggestions"
          style={({ pressed, hovered }: PressableState) => [
            styles.actionButton,
            hovered && styles.actionButtonHovered,
            pressed && styles.actionButtonPressed,
            isSorting && styles.actionButtonDisabled,
          ]}
        >
          <Text style={styles.aiSortText}>
            {isSorting ? 'SORTING...' : 'AI_SORT'}
          </Text>
        </Pressable>
        <Pressable
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Clear all items"
          accessibilityHint="Opens a confirmation to remove all items"
          style={({ pressed, hovered }: PressableState) => [
            styles.actionButton,
            hovered && styles.actionButtonHovered,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Text style={styles.clearText}>CLEAR</Text>
        </Pressable>
      </View>
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
      ? 'rgba(185, 194, 217, 0.12)'
      : Tokens.colors.neutral.border;

  return StyleSheet.create({
    actionsBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Tokens.spacing[4],
      paddingHorizontal: Tokens.spacing[2],
      alignItems: 'center',
    },
    actionsRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Tokens.spacing[3],
    },
    actionButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: isCosmic ? 8 : isNightAwe ? 10 : Tokens.radii.none,
      borderWidth: 1,
      borderColor,
      backgroundColor: isNightAwe
        ? t.colors.nightAwe?.surface?.base || 'rgba(8, 17, 30, 0.68)'
        : 'transparent',
      ...Platform.select({
        web: { transition: 'all 0.2s ease' },
      }),
    },
    actionButtonDisabled: {
      opacity: 0.5,
      pointerEvents: 'none',
    },
    actionButtonHovered: {
      backgroundColor: isNightAwe
        ? 'rgba(19, 34, 56, 0.84)'
        : isCosmic
          ? 'rgba(17, 26, 51, 0.6)'
          : Tokens.colors.neutral.dark,
    },
    actionButtonPressed: {
      opacity: 0.7,
    },
    countText: {
      fontFamily: Tokens.type.fontFamily.mono,
      color: isNightAwe
        ? t.colors.text?.muted || Tokens.colors.text.secondary
        : isCosmic
          ? '#B9C2D9'
          : Tokens.colors.text.secondary,
      fontSize: Tokens.type.xs,
      fontWeight: '700',
      letterSpacing: 1,
    },
    clearText: {
      fontFamily: Tokens.type.fontFamily.mono,
      color: accent,
      fontSize: Tokens.type.xs,
      fontWeight: '700',
      letterSpacing: 1,
    },
    aiSortText: {
      fontFamily: Tokens.type.fontFamily.mono,
      color: isNightAwe
        ? t.colors.text?.primary || Tokens.colors.text.primary
        : isCosmic
          ? '#EEF2FF'
          : Tokens.colors.text.primary,
      fontSize: Tokens.type.xs,
      fontWeight: '700',
      letterSpacing: 1,
    },
  });
};
