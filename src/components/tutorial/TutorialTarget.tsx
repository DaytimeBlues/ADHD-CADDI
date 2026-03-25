import React, { useEffect } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {
  registerTutorialTarget,
  unregisterTutorialTarget,
} from './useTutorialTargetRegistry';

type TutorialTargetProps = ViewProps & {
  targetId: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const TutorialTarget = ({
  targetId,
  children,
  onLayout,
  style,
  ...rest
}: TutorialTargetProps) => {
  useEffect(() => {
    return () => {
      unregisterTutorialTarget(targetId);
    };
  }, [targetId]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent;
    registerTutorialTarget(targetId, {
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
    });
    onLayout?.(event);
  };

  return (
    <View
      {...rest}
      onLayout={handleLayout}
      style={style}
      testID={`tutorial-target-${targetId}`}
    >
      {children}
    </View>
  );
};

export default TutorialTarget;
