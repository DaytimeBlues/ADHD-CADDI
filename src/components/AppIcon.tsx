import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type AppIconProps = {
  name: string;
  size: number;
  color: string;
  accessibilityLabel?: string;
};

const AppIcon = ({ name, size, color, accessibilityLabel }: AppIconProps) => {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

export default AppIcon;
