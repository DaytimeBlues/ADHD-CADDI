import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { siGoogle, siTodoist, type SimpleIcon } from 'simple-icons';

type BrandLogoName = 'google' | 'todoist';

type BrandLogoProps = {
  name: BrandLogoName;
  size: number;
  accessibilityLabel?: string;
};

const BRAND_ICONS: Record<BrandLogoName, SimpleIcon> = {
  google: siGoogle,
  todoist: siTodoist,
};

export const BrandLogo = ({
  name,
  size,
  accessibilityLabel,
}: BrandLogoProps) => {
  const icon = BRAND_ICONS[name];

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityLabel={accessibilityLabel}
    >
      <Path d={icon.path} fill={`#${icon.hex}`} />
    </Svg>
  );
};

export default BrandLogo;
