import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  Pressable,
  Text,
} from 'react-native';
import { LinearButton } from '../../components/ui/LinearButton';
import { Tokens } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import type { ThemeTokens } from '../../theme/types';
import type { ThemeVariant } from '../../theme/themeVariant';

export interface BrainDumpInputProps {
  onAdd: (text: string) => void;
}

export const BrainDumpInput: React.FC<BrainDumpInputProps> = ({ onAdd }) => {
  const { isCosmic, isNightAwe, t, variant } = useTheme();
  const styles = useMemo(() => getStyles(variant, t), [t, variant]);
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <View style={styles.inputSection}>
      <View
        style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="> INPUT_DATA..."
          placeholderTextColor={
            t.colors.text?.muted || Tokens.colors.text.placeholder
          }
          accessibilityLabel="Add a brain dump item"
          accessibilityHint="Type a thought and press Add"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAdd}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={false}
          returnKeyType="done"
          blurOnSubmit
        />
      </View>
      {isNightAwe ? (
        <Pressable
          onPress={handleAdd}
          accessibilityRole="button"
          accessibilityLabel="Add brain dump item"
          style={({ pressed }) => [
            styles.addButtonSurface,
            pressed && { opacity: 0.88 },
          ]}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      ) : (
        <LinearButton
          title="+"
          onPress={handleAdd}
          size="lg"
          style={isCosmic ? styles.addButtonCosmic : styles.addButtonLinear}
        />
      )}
    </View>
  );
};

const getStyles = (variant: ThemeVariant, t: ThemeTokens) => {
  const isCosmic = variant === 'cosmic';
  const isNightAwe = variant === 'nightAwe';
  const surfaceBase = isNightAwe
    ? t.colors.nightAwe?.surface?.base || 'rgba(8, 17, 30, 0.68)'
    : isCosmic
      ? 'rgba(11, 16, 34, 0.8)'
      : Tokens.colors.neutral.darker;
  const surfaceRaised = isNightAwe
    ? t.colors.nightAwe?.surface?.raised || 'rgba(13, 24, 40, 0.8)'
    : surfaceBase;
  const borderColor = isNightAwe
    ? t.colors.nightAwe?.surface?.border || 'rgba(217, 228, 242, 0.14)'
    : isCosmic
      ? 'rgba(139, 92, 246, 0.25)'
      : Tokens.colors.neutral.border;
  const accent = isNightAwe
    ? t.colors.nightAwe?.feature?.brainDump || t.colors.semantic.primary
    : isCosmic
      ? '#8B5CF6'
      : Tokens.colors.text.primary;
  const textPrimary = isNightAwe
    ? t.colors.text?.primary || Tokens.colors.text.primary
    : isCosmic
      ? '#EEF2FF'
      : Tokens.colors.text.primary;

  return StyleSheet.create({
    inputSection: {
      flexDirection: 'row',
      marginBottom: isCosmic ? 16 : Tokens.spacing[5],
      gap: isCosmic ? 8 : Tokens.spacing[2],
      alignItems: 'center',
    },
    inputWrapper: {
      flex: 1,
      backgroundColor: surfaceBase,
      borderRadius: isCosmic ? 12 : isNightAwe ? 16 : Tokens.radii.none,
      borderWidth: 1,
      borderColor,
      minHeight: 48,
      justifyContent: 'center',
      ...Platform.select({
        web: {
          transition: 'all 0.2s ease',
        },
      }),
    },
    inputWrapperFocused: {
      borderColor: accent,
      backgroundColor: surfaceRaised,
      ...Platform.select({
        web: isNightAwe
          ? { boxShadow: `0 0 0 1px ${accent}26` }
          : isCosmic
            ? {
                boxShadow:
                  '0 0 0 2px rgba(139, 92, 246, 0.3), 0 0 30px rgba(139, 92, 246, 0.25)',
              }
            : {},
      }),
    },
    input: {
      paddingHorizontal: Tokens.spacing[3],
      color: textPrimary,
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.sm,
      minHeight: 48,
      textAlignVertical: 'center',
      paddingVertical: 0,
      ...Platform.select({
        web: { outlineStyle: 'none' as const },
      }),
    },
    addButtonCosmic: {
      minHeight: 48,
      width: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    addButtonLinear: {
      minHeight: 48,
      width: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: Tokens.radii.none,
    },
    addButtonSurface: {
      minHeight: 48,
      width: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: accent,
      backgroundColor: accent,
    },
    addButtonText: {
      color: t.colors.text?.onAccent || '#08111E',
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.base,
      fontWeight: '700',
    },
  });
};
