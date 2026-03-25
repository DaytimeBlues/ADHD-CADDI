import React, { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { Tokens } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import type { ThemeTokens } from '../../theme/types';
import type { ThemeVariant } from '../../theme/themeVariant';

type PressableState = {
  pressed: boolean;
  hovered?: boolean;
};

export type RecordingState = 'idle' | 'recording' | 'processing';

export interface BrainDumpVoiceRecordProps {
  recordingState: RecordingState;
  recordingError: string | null;
  onRecordPress: () => void;
}

export const BrainDumpVoiceRecord: React.FC<BrainDumpVoiceRecordProps> = ({
  recordingState,
  recordingError,
  onRecordPress,
}) => {
  const { t, variant } = useTheme();
  const styles = useMemo(() => getStyles(variant, t), [t, variant]);

  return (
    <View style={styles.recordSection}>
      <Pressable
        testID="brain-dump-record-toggle"
        onPress={onRecordPress}
        disabled
        accessibilityRole="button"
        accessibilityLabel="Audio capture coming soon"
        accessibilityHint="Audio capture and transcription are not ready yet"
        style={({ pressed, hovered }: PressableState) => [
          styles.recordButton,
          hovered && styles.recordButtonHovered,
          styles.recordButtonProcessing,
          recordingState === 'recording' && styles.recordButtonActive,
          pressed && styles.recordButtonPressed,
        ]}
      >
        <ActivityIndicator size="small" color={styles.recordActivity.color} />
        <Text style={styles.recordText}>COMING SOON</Text>
      </Pressable>
      <Text style={styles.helperText}>
        Audio capture and transcription are not ready yet. This feature is
        planned for a later update.
      </Text>
      {recordingError && <Text style={styles.errorText}>{recordingError}</Text>}
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
      ? 'rgba(139, 92, 246, 0.3)'
      : Tokens.colors.neutral.border;

  return StyleSheet.create({
    recordSection: {
      alignItems: 'center',
      marginBottom: isCosmic ? 16 : Tokens.spacing[5],
    },
    recordButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isNightAwe
        ? t.colors.nightAwe?.surface?.base || 'rgba(8, 17, 30, 0.7)'
        : isCosmic
          ? 'rgba(17, 26, 51, 0.5)'
          : Tokens.colors.neutral.darkest,
      paddingHorizontal: isCosmic ? 12 : Tokens.spacing[3],
      paddingVertical: isCosmic ? 6 : Tokens.spacing[2],
      borderRadius: isCosmic ? 8 : isNightAwe ? 14 : Tokens.radii.none,
      borderWidth: 1,
      borderColor,
      minWidth: isCosmic ? 120 : 148,
      minHeight: isCosmic ? 36 : 48,
      justifyContent: 'center',
      ...Platform.select({
        web: {
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        },
      }),
    },
    recordButtonHovered: {
      borderColor: accent,
      backgroundColor: isNightAwe
        ? 'rgba(19, 34, 56, 0.84)'
        : isCosmic
          ? 'rgba(17, 26, 51, 0.7)'
          : undefined,
    },
    recordButtonActive: {
      backgroundColor: accent,
      borderColor: accent,
    },
    recordButtonProcessing: {
      opacity: 0.5,
      backgroundColor: Tokens.colors.neutral.dark,
    },
    recordButtonPressed: {
      opacity: 0.8,
    },
    recordActivity: {
      color: isNightAwe
        ? t.colors.text?.primary || Tokens.colors.text.primary
        : Tokens.colors.text.primary,
    },
    recordIcon: {
      fontSize: Tokens.type.base,
      marginRight: Tokens.spacing[2],
      color:
        variant === 'nightAwe'
          ? t.colors.text?.primary || Tokens.colors.text.primary
          : Tokens.colors.text.primary,
    },
    recordText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      fontWeight: '700',
      color:
        variant === 'nightAwe'
          ? t.colors.text?.primary || Tokens.colors.text.primary
          : Tokens.colors.text.primary,
      letterSpacing: 1,
    },
    errorText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      color: accent,
      textAlign: 'center',
      marginTop: Tokens.spacing[2],
    },
    helperText: {
      fontFamily: Tokens.type.fontFamily.sans,
      fontSize: Tokens.type.xs,
      color: isNightAwe
        ? t.colors.text?.secondary || Tokens.colors.text.secondary
        : isCosmic
          ? 'rgba(185, 194, 217, 0.86)'
          : Tokens.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 18,
      marginTop: Tokens.spacing[2],
      maxWidth: 320,
    },
  });
};
