import React from 'react';
import { Pressable, StyleProp, ViewStyle, StyleSheet } from 'react-native';

interface ScaleButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleAmount?: number;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const ScaleButton = ({
  onPress,
  children,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: ScaleButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [style, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});

export default ScaleButton;
