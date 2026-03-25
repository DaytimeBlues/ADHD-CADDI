import React, { createContext, useContext } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import * as SafeAreaContext from 'react-native-safe-area-context';
import type { TutorialStep } from '../../store/useTutorialStore';
import { Tokens } from '../../theme/tokens';
import { TutorialBubble } from './TutorialBubble';
import { useTutorialTargetRegistry } from './useTutorialTargetRegistry';
import {
  clampRectToFrame,
  getSafeFrame,
  resolveTutorialCardPosition,
} from './tutorialLayout';

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
  const { width, height } = useWindowDimensions();
  type InsetValue = {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  };
  const fallbackInsets: InsetValue = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  const FallbackInsetsContext = createContext<InsetValue | null>(
    fallbackInsets,
  );
  const InsetsContext: React.Context<InsetValue | null> =
    (
      SafeAreaContext as {
        SafeAreaInsetsContext?: React.Context<InsetValue | null>;
      }
    ).SafeAreaInsetsContext ?? FallbackInsetsContext;
  const insets = useContext(InsetsContext) ?? fallbackInsets;
  const { getTargetLayout } = useTutorialTargetRegistry();
  const safeFrame = getSafeFrame({
    viewportWidth: width,
    viewportHeight: height,
    insets,
    margin: Tokens.spacing[4],
  });
  const rawTargetRect = step.targetId ? getTargetLayout(step.targetId) : null;
  const targetRect = rawTargetRect
    ? clampRectToFrame(rawTargetRect, safeFrame)
    : null;
  const cardWidth = Math.min(safeFrame.width, 400);
  const cardHeight = Math.min(320, safeFrame.height);
  const cardPosition = resolveTutorialCardPosition({
    targetRect,
    cardSize: { width: cardWidth, height: cardHeight },
    safeFrame,
    placement: step.placement ?? 'auto',
    gap: Tokens.spacing[3],
  });

  return (
    <View style={styles.overlay} testID="tutorial-overlay">
      <View style={styles.scrim} testID="tutorial-overlay-scrim" />
      {targetRect ? (
        <View
          pointerEvents="none"
          style={[
            styles.highlightBox,
            {
              left: targetRect.x,
              top: targetRect.y,
              width: targetRect.width,
              height: targetRect.height,
            },
          ]}
          testID="tutorial-highlight-box"
        />
      ) : null}
      <View
        style={[
          styles.content,
          {
            left: cardPosition.x,
            top: cardPosition.y,
            width: cardWidth,
            maxHeight: cardHeight,
          },
        ]}
      >
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
    zIndex: 1000,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 11, 20, 0.72)',
  },
  content: {
    position: 'absolute',
  },
  header: {
    width: '100%',
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
  highlightBox: {
    position: 'absolute',
    borderRadius: Tokens.radii.lg,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
});

export default TutorialSpotlightOverlay;
