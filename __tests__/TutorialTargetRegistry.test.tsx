import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { TutorialTarget } from '../src/components/tutorial/TutorialTarget';
import { useTutorialTargetRegistry } from '../src/components/tutorial/useTutorialTargetRegistry';

const RegistryProbe = ({ targetId }: { targetId: string }) => {
  const { getTargetLayout } = useTutorialTargetRegistry();
  const layout = getTargetLayout(targetId);

  return (
    <Text testID="registry-probe">
      {layout
        ? `${layout.x},${layout.y},${layout.width},${layout.height}`
        : 'missing'}
    </Text>
  );
};

describe('Tutorial target registry', () => {
  it('registers a target layout when the wrapper is measured', () => {
    const view = render(
      <>
        <TutorialTarget targetId="tasks-add-input">
          <Text>Target</Text>
        </TutorialTarget>
        <RegistryProbe targetId="tasks-add-input" />
      </>,
    );

    fireEvent(view.getByTestId('tutorial-target-tasks-add-input'), 'layout', {
      nativeEvent: {
        layout: {
          x: 12,
          y: 24,
          width: 160,
          height: 48,
        },
      },
    });

    expect(view.getByTestId('registry-probe').props.children).toBe(
      '12,24,160,48',
    );
  });

  it('unregisters a target when the wrapper unmounts', () => {
    const view = render(
      <>
        <TutorialTarget targetId="brain-dump-sort">
          <Text>Sort</Text>
        </TutorialTarget>
        <RegistryProbe targetId="brain-dump-sort" />
      </>,
    );

    fireEvent(view.getByTestId('tutorial-target-brain-dump-sort'), 'layout', {
      nativeEvent: {
        layout: {
          x: 8,
          y: 18,
          width: 140,
          height: 44,
        },
      },
    });

    expect(view.getByTestId('registry-probe').props.children).toBe(
      '8,18,140,44',
    );

    view.rerender(<RegistryProbe targetId="brain-dump-sort" />);

    expect(view.getByTestId('registry-probe').props.children).toBe('missing');
  });
});
