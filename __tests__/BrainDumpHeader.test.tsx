import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { BrainDumpHeader } from '../src/screens/brain-dump/BrainDumpHeader';

jest.mock('../src/components/tutorial/TutorialBubble', () => {
  const { Text, View } = require('react-native');
  return {
    TutorialBubble: ({ step }: { step: { title: string } }) => (
      <View testID="tutorial-bubble-mock">
        <Text>{step.title}</Text>
      </View>
    ),
  };
});

const styles = {
  header: {},
  title: {},
  headerLine: {},
  tourButton: {},
  tourButtonPressed: {},
  tourButtonText: {},
  tutorialOverlay: {},
};

describe('BrainDumpHeader', () => {
  it('renders the tour button and starts the tutorial flow', () => {
    const startTutorial = jest.fn();
    const flow = {
      id: 'brain-dump',
      name: 'Brain Dump',
      steps: [
        {
          id: 'step-1',
          title: 'Step 1',
          whyText: 'Why',
          howText: 'How',
        },
      ],
    };

    render(
      <BrainDumpHeader
        styles={styles}
        currentTutorialStep={null}
        currentStepIndex={0}
        totalSteps={0}
        brainDumpOnboardingFlow={flow}
        startTutorial={startTutorial}
        nextStep={jest.fn()}
        previousStep={jest.fn()}
        skipTutorial={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByTestId('brain-dump-tour-button'));
    expect(startTutorial).toHaveBeenCalledWith(flow);
  });

  it('renders the tutorial overlay when a step is active', () => {
    render(
      <BrainDumpHeader
        styles={styles}
        currentTutorialStep={{
          id: 'step-1',
          title: 'Brain Dump: Clear the Noise',
          whyText: 'Why',
          howText: 'How',
        }}
        currentStepIndex={0}
        totalSteps={2}
        brainDumpOnboardingFlow={{
          id: 'brain-dump',
          name: 'Brain Dump',
          steps: [],
        }}
        startTutorial={jest.fn()}
        nextStep={jest.fn()}
        previousStep={jest.fn()}
        skipTutorial={jest.fn()}
      />,
    );

    expect(screen.getByTestId('tutorial-overlay')).toBeTruthy();
    expect(screen.getByText('Brain Dump: Clear the Noise')).toBeTruthy();
  });
});
