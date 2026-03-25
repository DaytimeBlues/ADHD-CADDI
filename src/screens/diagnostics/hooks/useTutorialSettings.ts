import { useCallback } from 'react';
import { useTutorialStore } from '../../../store/useTutorialStore';

export type UseTutorialSettingsResult = {
  tutorialsEnabled: boolean;
  setTutorialsEnabled: (enabled: boolean) => void;
  resetTutorialProgress: () => void;
};

export const useTutorialSettings = (): UseTutorialSettingsResult => {
  const tutorialsEnabled = useTutorialStore((state) => state.tutorialsEnabled);
  const setTutorialsEnabled = useTutorialStore(
    (state) => state.setTutorialsEnabled,
  );
  const resetTutorials = useTutorialStore((state) => state.resetTutorials);

  const resetTutorialProgress = useCallback(() => {
    resetTutorials();
  }, [resetTutorials]);

  return {
    tutorialsEnabled,
    setTutorialsEnabled,
    resetTutorialProgress,
  };
};

export default useTutorialSettings;
