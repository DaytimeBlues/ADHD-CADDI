import { useEffect, useRef } from 'react';
import { TutorialFlow, useTutorialStore } from '../store/useTutorialStore';

export const useFeatureTutorial = (flow?: TutorialFlow | null) => {
  const hasAutoStartedTutorial = useRef(false);
  const activeFlow = useTutorialStore((state) => state.activeFlow);
  const currentStepIndex = useTutorialStore((state) => state.currentStepIndex);
  const isTutorialVisible = useTutorialStore((state) => state.isVisible);
  const onboardingCompleted = useTutorialStore(
    (state) => state.onboardingCompleted,
  );
  const startTutorial = useTutorialStore((state) => state.startTutorial);
  const nextStep = useTutorialStore((state) => state.nextStep);
  const previousStep = useTutorialStore((state) => state.previousStep);
  const skipTutorial = useTutorialStore((state) => state.skipTutorial);

  useEffect(() => {
    if (!flow || hasAutoStartedTutorial.current || onboardingCompleted) {
      return;
    }

    if (!isTutorialVisible && activeFlow === null) {
      hasAutoStartedTutorial.current = true;
      startTutorial(flow);
    }
  }, [activeFlow, isTutorialVisible, onboardingCompleted, startTutorial, flow]);

  const currentTutorialStep =
    flow && isTutorialVisible && activeFlow?.id === flow.id
      ? activeFlow.steps[currentStepIndex] ?? null
      : null;

  return {
    currentTutorialStep,
    currentStepIndex,
    totalSteps:
      flow && activeFlow?.id === flow.id ? activeFlow.steps.length : 0,
    nextStep,
    previousStep,
    skipTutorial,
    startTutorial: () => {
      if (flow) {
        startTutorial(flow);
      }
    },
  };
};
