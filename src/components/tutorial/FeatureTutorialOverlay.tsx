import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { TutorialStep } from '../../store/useTutorialStore';
import { TutorialSpotlightOverlay } from './TutorialSpotlightOverlay';

type FeatureTutorialOverlayProps = {
  currentTutorialStep: TutorialStep | null;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  style?: StyleProp<ViewStyle>;
};

export const FeatureTutorialOverlay = ({
  currentTutorialStep,
  currentStepIndex,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  style,
}: FeatureTutorialOverlayProps) => {
  if (!currentTutorialStep) {
    return null;
  }

  return (
    <View style={style}>
      <TutorialSpotlightOverlay
        step={currentTutorialStep}
        stepIndex={currentStepIndex}
        totalSteps={totalSteps}
        onNext={onNext}
        onPrevious={onPrevious}
        onDismiss={onSkip}
      />
    </View>
  );
};

export default FeatureTutorialOverlay;
