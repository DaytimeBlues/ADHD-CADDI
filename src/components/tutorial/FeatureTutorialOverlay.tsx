import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
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
  style: _style,
}: FeatureTutorialOverlayProps) => {
  if (!currentTutorialStep) {
    return null;
  }

  return (
    <TutorialSpotlightOverlay
      step={currentTutorialStep}
      stepIndex={currentStepIndex}
      totalSteps={totalSteps}
      onNext={onNext}
      onPrevious={onPrevious}
      onDismiss={onSkip}
    />
  );
};

export default FeatureTutorialOverlay;
