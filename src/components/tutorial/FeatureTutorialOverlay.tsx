import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { TutorialBubble } from './TutorialBubble';
import type { TutorialStep } from '../../store/useTutorialStore';

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
    <View style={style} testID="tutorial-overlay">
      <TutorialBubble
        step={currentTutorialStep}
        stepIndex={currentStepIndex}
        totalSteps={totalSteps}
        isFirstStep={currentStepIndex === 0}
        isLastStep={currentStepIndex === totalSteps - 1}
        onNext={onNext}
        onPrevious={onPrevious}
        onSkip={onSkip}
      />
    </View>
  );
};

export default FeatureTutorialOverlay;
