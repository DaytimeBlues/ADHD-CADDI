import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TutorialStep } from '../../store/useTutorialStore';
import { Tokens } from '../../theme/tokens';
import { TutorialBubble } from './TutorialBubble';

type TutorialSpotlightOverlayProps = {
  step: TutorialStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onDismiss: () => void;
};

export const TutorialSpotlightOverlay = ({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onPrevious,
  onDismiss,
}: TutorialSpotlightOverlayProps) => {
  return (
    <View style={styles.overlay} testID="tutorial-overlay">
      <View style={styles.scrim} testID="tutorial-overlay-scrim" />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss tutorial"
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.dismissButton,
              pressed && styles.dismissButtonPressed,
            ]}
            testID="tutorial-dismiss-button"
          >
            <Text style={styles.dismissButtonText}>X</Text>
          </Pressable>
        </View>
        <TutorialBubble
          step={step}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          isFirstStep={stepIndex === 0}
          isLastStep={stepIndex === totalSteps - 1}
          onNext={onNext}
          onPrevious={onPrevious}
          onSkip={onDismiss}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 11, 20, 0.72)',
  },
  content: {
    width: '100%',
    paddingHorizontal: Tokens.spacing[4],
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Tokens.spacing[3],
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  dismissButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(238, 242, 255, 0.24)',
  },
  dismissButtonPressed: {
    opacity: 0.78,
  },
  dismissButtonText: {
    color: '#EEF2FF',
    fontFamily: Tokens.type.fontFamily.mono,
    fontSize: Tokens.type.base,
    fontWeight: '700',
  },
});

export default TutorialSpotlightOverlay;
