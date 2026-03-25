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
  const tutorialsEnabled = useTutorialStore((state) => state.tutorialsEnabled);
  const hasCompletedFlow = useTutorialStore((state) => state.hasCompletedFlow);
  const hasInteractedWithFlow = useTutorialStore(
    (state) => state.hasInteractedWithFlow,
  );
  const startTutorial = useTutorialStore((state) => state.startTutorial);
  const nextStep = useTutorialStore((state) => state.nextStep);
  const previousStep = useTutorialStore((state) => state.previousStep);
  const skipTutorial = useTutorialStore((state) => state.skipTutorial);

  useEffect(() => {
    if (
      !flow ||
      flow.autoStart === false ||
      !tutorialsEnabled ||
      hasAutoStartedTutorial.current ||
      onboardingCompleted
    ) {
      return;
    }

    if (!isTutorialVisible && activeFlow === null) {
      hasAutoStartedTutorial.current = true;
      startTutorial(flow);
    }
  }, [
    activeFlow,
    isTutorialVisible,
    onboardingCompleted,
    startTutorial,
    flow,
    tutorialsEnabled,
  ]);

  const currentTutorialStep =
    flow && isTutorialVisible && activeFlow?.id === flow.id
      ? activeFlow.steps[currentStepIndex] ?? null
      : null;

  const hasSeenFlow = flow
    ? (typeof hasCompletedFlow === 'function' && hasCompletedFlow(flow.id)) ||
      (typeof hasInteractedWithFlow === 'function' &&
        hasInteractedWithFlow(flow.id))
    : false;

  return {
    currentTutorialStep,
    currentStepIndex,
    totalSteps:
      flow && activeFlow?.id === flow.id ? activeFlow.steps.length : 0,
    nextStep,
    previousStep,
    skipTutorial,
    isReplayTutorial: hasSeenFlow,
    guideButtonLabel: hasSeenFlow ? 'Replay Tutorial' : 'Tutorial',
    startTutorial: () => {
      if (flow) {
        startTutorial(flow);
      }
    },
  };
};
