import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import TasksScreen from '../src/screens/TasksScreen';

const mockStartTutorial = jest.fn();

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
  }),
}));

jest.mock('../src/hooks/useFeatureTutorial', () => ({
  useFeatureTutorial: () => ({
    currentTutorialStep: null,
    currentStepIndex: 0,
    totalSteps: 0,
    nextStep: jest.fn(),
    previousStep: jest.fn(),
    skipTutorial: jest.fn(),
    startTutorial: mockStartTutorial,
  }),
}));

jest.mock('../src/hooks/useBrainDump', () => ({
  useBrainDump: () => ({
    items: [],
    addItem: jest.fn(),
    deleteItem: jest.fn(),
    showGuide: false,
    dismissGuide: jest.fn(),
  }),
}));

jest.mock('../src/store/useTaskStore', () => ({
  useTaskStore: (
    selector: (state: {
      tasks: Array<{
        id: string;
        title: string;
        priority: string;
        completed: boolean;
      }>;
      addTask: jest.Mock;
      toggleTask: jest.Mock;
      deleteTask: jest.Mock;
    }) => unknown,
  ) =>
    selector({
      tasks: [],
      addTask: jest.fn(),
      toggleTask: jest.fn(),
      deleteTask: jest.fn(),
    }),
}));

jest.mock('../src/components/brain-dump', () => {
  const { View } = require('react-native');
  return {
    BrainDumpInput: () => <View />,
    BrainDumpItem: () => <View />,
    BrainDumpGuide: () => <View />,
  };
});

jest.mock('../src/ui/cosmic', () => {
  const { Text, View, Pressable } = require('react-native');
  return {
    CosmicBackground: ({ children }: { children: React.ReactNode }) => (
      <View>{children}</View>
    ),
    GlowCard: ({ children }: { children: React.ReactNode }) => (
      <View>{children}</View>
    ),
    RuneButton: ({
      children,
      onPress,
    }: {
      children: React.ReactNode;
      onPress?: () => void;
    }) => (
      <Pressable onPress={onPress}>
        <Text>{children}</Text>
      </Pressable>
    ),
  };
});

jest.mock('../src/ui/nightAwe', () => {
  const { View } = require('react-native');
  return {
    NightAweBackground: ({ children }: { children: React.ReactNode }) => (
      <View>{children}</View>
    ),
  };
});

jest.mock('react-native-reanimated', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  const AnimatedView = ReactLocal.forwardRef(
    (
      props: React.ComponentProps<typeof View> & { children?: React.ReactNode },
      ref: React.Ref<typeof View>,
    ) => <View ref={ref} {...props} />,
  );

  return {
    __esModule: true,
    default: {
      View: AnimatedView,
    },
    FadeIn: {
      delay: () => ({
        duration: () => ({}),
      }),
    },
    Layout: {
      springify: () => ({}),
    },
    SlideInRight: {
      delay: () => ({
        duration: () => ({}),
      }),
    },
  };
});

describe('TasksScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows Replay Guide and starts the shared tasks tutorial', () => {
    render(<TasksScreen />);

    expect(screen.getByText('TUTORIAL')).toBeTruthy();
    expect(screen.getByTestId('tutorial-target-tasks-capture')).toBeTruthy();
    expect(screen.getByTestId('tutorial-target-tasks-filters')).toBeTruthy();

    fireEvent.press(screen.getByTestId('tasks-guide-button'));

    expect(mockStartTutorial).toHaveBeenCalledTimes(1);
  });
});
