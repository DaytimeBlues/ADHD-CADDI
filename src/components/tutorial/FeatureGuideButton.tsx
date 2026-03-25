import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Tokens } from '../../theme/tokens';

type FeatureGuideButtonProps = {
  onPress: () => void;
  accessibilityLabel: string;
  testID: string;
};

export const FeatureGuideButton = ({
  onPress,
  accessibilityLabel,
  testID,
}: FeatureGuideButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.buttonText}>REPLAY GUIDE</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: Tokens.spacing[3],
    paddingVertical: Tokens.spacing[2],
    borderRadius: Tokens.radii.md,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: Tokens.type.fontFamily.mono,
    fontSize: Tokens.type.xs,
    fontWeight: '700',
    color: '#8B5CF6',
    letterSpacing: 1,
  },
});

export default FeatureGuideButton;
