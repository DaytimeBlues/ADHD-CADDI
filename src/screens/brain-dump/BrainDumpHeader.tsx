import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { TutorialBubble } from '../../components/tutorial/TutorialBubble';
import type {
  TutorialFlow,
  TutorialStep,
} from '../../store/useTutorialStore';

interface BrainDumpHeaderProps {
  styles: {
    header: object;
    title: object;
    headerLine: object;
    tourButton: object;
    tourButtonPressed: object;
    tourButtonText: object;
    tutorialOverlay: object;
  };
  currentTutorialStep: TutorialStep | null;
  currentStepIndex: number;
  totalSteps: number;
  brainDumpOnboardingFlow: TutorialFlow;
  startTutorial: (flow: TutorialFlow) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
}

export function BrainDumpHeader({
  styles,
  currentTutorialStep,
  currentStepIndex,
  totalSteps,
  brainDumpOnboardingFlow,
  startTutorial,
  nextStep,
  previousStep,
  skipTutorial,
}: BrainDumpHeaderProps) {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>BRAIN_DUMP</Text>
        <View style={styles.headerLine} />
        <Pressable
          onPress={() => startTutorial(brainDumpOnboardingFlow)}
          accessibilityRole="button"
          accessibilityLabel="Start brain dump tutorial"
          testID="brain-dump-tour-button"
          style={({ pressed }) => [
            styles.tourButton,
            pressed && styles.tourButtonPressed,
          ]}
        >
          <Text style={styles.tourButtonText}>TOUR</Text>
        </Pressable>
      </View>

      {currentTutorialStep && (
        <View style={styles.tutorialOverlay} testID="tutorial-overlay">
          <TutorialBubble
            step={currentTutorialStep}
            stepIndex={currentStepIndex}
            totalSteps={totalSteps}
            isFirstStep={currentStepIndex === 0}
            isLastStep={currentStepIndex === totalSteps - 1}
            onNext={nextStep}
            onPrevious={previousStep}
            onSkip={skipTutorial}
          />
        </View>
      )}
    </>
  );
}
