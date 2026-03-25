import {
  brainDumpOnboardingFlow,
  useTutorialStore,
} from '../src/store/useTutorialStore';

describe('useTutorialStore guided tutorial settings', () => {
  beforeEach(() => {
    useTutorialStore.getState().resetTutorials();
    useTutorialStore.setState({
      tutorialsEnabled: true,
      activeFlow: null,
      currentStepIndex: 0,
      isVisible: false,
    });
  });

  it('allows tutorials to be globally disabled without clearing tutorial history', () => {
    useTutorialStore.setState({
      onboardingCompleted: true,
      completedFlows: [brainDumpOnboardingFlow.id],
    });

    useTutorialStore.getState().setTutorialsEnabled(false);

    expect(useTutorialStore.getState().tutorialsEnabled).toBe(false);
    expect(useTutorialStore.getState().completedFlows).toEqual([
      brainDumpOnboardingFlow.id,
    ]);
  });

  it('resets tutorial progress while keeping tutorials enabled', () => {
    useTutorialStore.setState({
      onboardingCompleted: true,
      completedFlows: [brainDumpOnboardingFlow.id],
      lastTutorialAt: Date.now(),
    });

    useTutorialStore.getState().resetTutorials();

    expect(useTutorialStore.getState().tutorialsEnabled).toBe(true);
    expect(useTutorialStore.getState().onboardingCompleted).toBe(false);
    expect(useTutorialStore.getState().completedFlows).toEqual([]);
    expect(useTutorialStore.getState().lastTutorialAt).toBeNull();
  });

  it('supports target metadata on tutorial steps', () => {
    const firstStep = brainDumpOnboardingFlow.steps[0];

    expect(firstStep.targetId).toBe('brain-dump-input');
    expect(firstStep.placement).toBe('bottom');
  });

  it('marks a skipped flow as replayable without marking it completed', () => {
    useTutorialStore.getState().startTutorial(brainDumpOnboardingFlow);

    useTutorialStore.getState().skipTutorial();

    expect(useTutorialStore.getState().completedFlows).toEqual([]);
    expect(
      useTutorialStore
        .getState()
        .hasInteractedWithFlow(brainDumpOnboardingFlow.id),
    ).toBe(true);
  });
});
