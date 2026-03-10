import React from 'react';
import { StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { CosmicTokens } from '../src/theme/cosmicTokens';
import { TaskItem } from '../src/screens/TasksScreen.TaskItem';
import type { Task } from '../src/types/task';

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  title: 'Task title',
  priority: 'urgent',
  completed: false,
  source: 'manual',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

jest.mock('../src/ui/cosmic', () => {
  const { View, TouchableOpacity } = require('react-native');

  return {
    __esModule: true,
    GlowCard: ({
      children,
      onPress,
    }: {
      children: React.ReactNode;
      onPress?: () => void;
    }) => (
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <View>{children}</View>
      </TouchableOpacity>
    ),
  };
});

jest.mock('react-native-reanimated', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  const AnimatedView = ReactLocal.forwardRef(
    (
      props: React.ComponentProps<typeof View> & { children: React.ReactNode },
      ref: React.Ref<typeof View>,
    ) => <View ref={ref} {...props} />,
  );

  return {
    __esModule: true,
    default: {
      View: AnimatedView,
    },
    useSharedValue: (value: number) => ({ value }),
    useAnimatedStyle: (updater: () => object) => updater(),
    withSpring: (value: number) => value,
    withSequence: (...values: number[]) => values[values.length - 1],
  };
});

describe('TaskItem', () => {
  it('uses the semantic error color for urgent badge text', () => {
    render(
      <TaskItem
        task={createTask({ priority: 'urgent' })}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    const urgentLabel = screen.getByText('URGENT');
    const urgentLabelStyle = StyleSheet.flatten(urgentLabel.props.style);

    expect(urgentLabelStyle.color).toBe(CosmicTokens.colors.semantic.error);
  });

  it('uses the semantic warning color for important badge text', () => {
    render(
      <TaskItem
        task={createTask({ priority: 'important' })}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    const importantLabel = screen.getByText('IMPORTANT');
    const importantLabelStyle = StyleSheet.flatten(importantLabel.props.style);

    expect(importantLabelStyle.color).toBe(
      CosmicTokens.colors.semantic.warning,
    );
  });

  it('keeps completed urgent checkbox fill and border aligned to the semantic error color', () => {
    render(
      <TaskItem
        task={createTask({ completed: true, priority: 'urgent' })}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    const checkbox = screen.getByTestId('task-checkbox-task-1');
    const checkboxStyle = StyleSheet.flatten(checkbox.props.style);

    expect(checkboxStyle.backgroundColor).toBe(
      CosmicTokens.colors.semantic.error,
    );
    expect(checkboxStyle.borderColor).toBe(CosmicTokens.colors.semantic.error);
  });
});
