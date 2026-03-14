import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { BrainDumpActiveTasksSection } from '../src/screens/brain-dump/BrainDumpActiveTasksSection';

const styles = {
  sortedSection: {},
  sortedHeader: {},
  sortedItemRow: {},
  sortedItemText: {},
};

describe('BrainDumpActiveTasksSection', () => {
  it('renders nothing when there are no active tasks', () => {
    render(<BrainDumpActiveTasksSection tasks={[]} styles={styles} />);

    expect(screen.queryByText('ACTIVE_TASKS')).toBeNull();
  });

  it('renders active task titles in the existing section format', () => {
    render(
      <BrainDumpActiveTasksSection
        tasks={[
          { id: '1', title: 'Task one' },
          { id: '2', title: 'Task two' },
        ]}
        styles={styles}
      />,
    );

    expect(screen.getByText('ACTIVE_TASKS')).toBeTruthy();
    expect(screen.getByText('Task one')).toBeTruthy();
    expect(screen.getByText('Task two')).toBeTruthy();
  });
});
