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

export interface DumpItem {
  id: string;
  text: string;
  createdAt: string;
  source: 'text' | 'audio';
  audioPath?: string;
}

interface BrainDumpItemProps {
  item: DumpItem;
  onDelete: (id: string) => void;
}

const HIT_SLOP = {
  top: Tokens.spacing[4],
  bottom: Tokens.spacing[4],
  left: Tokens.spacing[4],
  right: Tokens.spacing[4],
};

export const BrainDumpItem: React.FC<BrainDumpItemProps> = ({
  item,
  onDelete,
}) => {
  const { t, variant } = useTheme();
  const styles = useMemo(() => getStyles(variant, t), [t, variant]);

  return (
    <View style={styles.item} testID="brain-dump-item">
      <Text style={styles.itemText}>{item.text}</Text>
      <Pressable
        onPress={() => onDelete(item.id)}
        testID="delete-item-button"
        accessibilityRole="button"
        accessibilityLabel="Delete brain dump item"
        accessibilityHint="Removes this item from the list"
        style={({ pressed, hovered }: PressableState) => [
          styles.deleteButton,
          hovered && styles.deleteButtonHovered,
          pressed && styles.deleteButtonPressed,
        ]}
        hitSlop={HIT_SLOP}
      >
        <Text style={styles.deleteText}>x</Text>
      </Pressable>
    </View>
  );
};

const getStyles = (variant: ThemeVariant, t: ThemeTokens) => {
  const isCosmic = variant === 'cosmic';
  const isNightAwe = variant === 'nightAwe';
  const borderColor = isNightAwe
    ? t.colors.nightAwe?.surface?.border || 'rgba(217, 228, 242, 0.14)'
    : isCosmic
      ? 'rgba(139, 92, 246, 0.2)'
      : Tokens.colors.neutral.border;
  const surface = isNightAwe
    ? t.colors.nightAwe?.surface?.raised || 'rgba(13, 24, 40, 0.76)'
    : isCosmic
      ? 'rgba(17, 26, 51, 0.4)'
      : Tokens.colors.neutral.darkest;
  const hoverSurface = isNightAwe
    ? 'rgba(19, 34, 56, 0.84)'
    : Tokens.colors.neutral.dark;

  return StyleSheet.create({
    item: {
      backgroundColor: surface,
      borderRadius: isCosmic ? 8 : isNightAwe ? 14 : Tokens.radii.none,
      paddingHorizontal: isCosmic ? 12 : Tokens.spacing[3],
      paddingVertical: isCosmic ? 8 : isNightAwe ? 10 : Tokens.spacing[2],
      marginBottom: isCosmic ? 6 : isNightAwe ? 8 : -1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor,
      minHeight: isCosmic ? 40 : isNightAwe ? 44 : 48,
      ...Platform.select({
        web: {
          transition: 'all 0.2s ease',
        },
      }),
    },
    itemText: {
      flex: 1,
      color: isNightAwe
        ? t.colors.text?.primary || Tokens.colors.text.primary
        : isCosmic
          ? '#EEF2FF'
          : Tokens.colors.text.primary,
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      lineHeight: 16,
      marginRight: isCosmic ? 8 : Tokens.spacing[3],
    },
    deleteButton: {
      padding: 0,
      borderRadius: isCosmic ? 6 : isNightAwe ? 8 : Tokens.radii.none,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        web: { transition: 'all 0.2s ease' },
      }),
    },
    deleteButtonHovered: {
      backgroundColor: hoverSurface,
    },
    deleteButtonPressed: {
      backgroundColor: borderColor,
    },
    deleteText: {
      color: isNightAwe
        ? t.colors.text?.muted || Tokens.colors.text.secondary
        : isCosmic
          ? '#B9C2D9'
          : Tokens.colors.text.secondary,
      fontSize: Tokens.type.base,
      fontWeight: '500',
      marginTop: -1,
    },
  });
};
