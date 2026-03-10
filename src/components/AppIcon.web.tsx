import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { getWebIconGlyph } from './icons/webIconGlyphs';

type AppIconProps = {
  name: string;
  size: number;
  color: string;
  accessibilityLabel?: string;
};

const AppIcon = ({ name, size, color, accessibilityLabel }: AppIconProps) => {
  return (
    <Text
      accessibilityLabel={accessibilityLabel}
      style={[styles.icon, { color, fontSize: size, lineHeight: size }]}
    >
      {getWebIconGlyph(name)}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default AppIcon;
