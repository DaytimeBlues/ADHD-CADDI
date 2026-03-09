/**
 * HomeModesGrid Component
 *
 * Grid of mode cards with entrance animations.
 */

import React from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import ModeCard, { ModeCardMode } from '../ModeCard';

interface Mode extends ModeCardMode {
  id: string;
}

interface HomeModesGridProps {
  modes: Mode[];
  fadeAnims: Animated.Value[];
  slideAnims: Animated.Value[];
  cardWidth: string | number;
  styles: {
    modesGrid: object;
    negativeMarginTop24: object;
    zIndex10: object;
  };
  onModePress: (modeId: string) => void;
}

export function HomeModesGrid({
  modes,
  fadeAnims,
  slideAnims,
  cardWidth,
  styles,
  onModePress,
}: HomeModesGridProps) {
  return (
    <View style={[styles.modesGrid, styles.negativeMarginTop24]}>
      {modes.map((mode, index) => (
        <Animated.View
          key={mode.id}
          style={[
            {
              width: cardWidth,
              opacity: fadeAnims[index],
              transform: [{ translateY: slideAnims[index] }],
            } as ViewStyle,
            styles.zIndex10,
          ]}
        >
          <ModeCard
            mode={mode}
            onPress={() => onModePress(mode.id)}
            testID={`mode-${mode.id}`}
          />
        </Animated.View>
      ))}
    </View>
  );
}
