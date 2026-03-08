import { useEffect, useRef } from 'react';
import {
  brainDumpOnboardingFlow,
  useTutorialStore,
} from '../../store/useTutorialStore';

export const useBrainDumpTutorial = () => {
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
    if (hasAutoStartedTutorial.current || onboardingCompleted) {
      return;
    }

    if (!isTutorialVisible && activeFlow === null) {
      hasAutoStartedTutorial.current = true;
      startTutorial(brainDumpOnboardingFlow);
    }
  }, [activeFlow, isTutorialVisible, onboardingCompleted, startTutorial]);

  const currentTutorialStep =
    isTutorialVisible && activeFlow
      ? activeFlow.steps[currentStepIndex] ?? null
      : null;

  return {
    brainDumpOnboardingFlow,
    currentTutorialStep,
    currentStepIndex,
    totalSteps: activeFlow?.steps.length ?? 0,
    nextStep,
    previousStep,
    skipTutorial,
    startTutorial,
  };
};

export default useBrainDumpTutorial;
