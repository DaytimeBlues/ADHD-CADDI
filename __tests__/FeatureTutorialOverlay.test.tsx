import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FeatureTutorialOverlay } from '../src/components/tutorial/FeatureTutorialOverlay';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 24,
    right: 0,
    bottom: 32,
    left: 0,
  }),
}));

const tutorialStep = {
  id: 'brain-dump-capture',
  title: 'Capture Everything',
  whyText: 'This keeps thoughts from competing for attention.',
  howText: 'Use the input first, then move to sorting later.',
  targetId: 'brain-dump-input',
  placement: 'bottom' as const,
};

describe('FeatureTutorialOverlay', () => {
  it('renders a spotlight overlay shell with a prominent dismiss control', () => {
    const onSkip = jest.fn();
    const view = render(
      <FeatureTutorialOverlay
        currentTutorialStep={tutorialStep}
        currentStepIndex={0}
        totalSteps={3}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onSkip={onSkip}
      />,
    );

    expect(view.getByTestId('tutorial-overlay')).toBeTruthy();
    expect(view.getByTestId('tutorial-overlay-scrim')).toBeTruthy();
    expect(
      view.UNSAFE_getByProps({ testID: 'tutorial-dismiss-button' }),
    ).toBeTruthy();

    fireEvent.press(
      view.UNSAFE_getByProps({ testID: 'tutorial-dismiss-button' }),
    );

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('shows what and why guidance inside the overlay card', () => {
    const view = render(
      <FeatureTutorialOverlay
        currentTutorialStep={tutorialStep}
        currentStepIndex={1}
        totalSteps={3}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onSkip={jest.fn()}
      />,
    );

    expect(view.getByText('Capture Everything')).toBeTruthy();
    expect(
      view.getByText('This keeps thoughts from competing for attention.'),
    ).toBeTruthy();
    expect(
      view.getByText('Use the input first, then move to sorting later.'),
    ).toBeTruthy();
  });
});
