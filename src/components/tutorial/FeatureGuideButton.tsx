import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Tokens } from '../../theme/tokens';

type FeatureGuideButtonProps = {
  onPress: () => void;
  accessibilityLabel: string;
  testID: string;
  label?: string;
  isSecondary?: boolean;
};

export const FeatureGuideButton = ({
  onPress,
  accessibilityLabel,
  testID,
  label = 'Tutorial',
  isSecondary = false,
}: FeatureGuideButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        isSecondary ? styles.buttonSecondary : styles.buttonPrimary,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          isSecondary ? styles.buttonTextSecondary : styles.buttonTextPrimary,
        ]}
      >
        {label.toUpperCase()}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: Tokens.spacing[3],
    paddingVertical: Tokens.spacing[2],
    borderRadius: Tokens.radii.md,
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    minHeight: 40,
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.24)',
    paddingHorizontal: Tokens.spacing[2],
    minHeight: 32,
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: Tokens.type.fontFamily.mono,
    fontWeight: '700',
  },
  buttonTextPrimary: {
    fontSize: Tokens.type.xs,
    color: '#8B5CF6',
    letterSpacing: 1,
  },
  buttonTextSecondary: {
    fontSize: Tokens.type.xxs,
    color: '#A78BFA',
    letterSpacing: 0.8,
  },
});

export default FeatureGuideButton;
