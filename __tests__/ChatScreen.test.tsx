import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ChatScreen from '../src/screens/ChatScreen';

const mockSendMessage = jest.fn().mockResolvedValue(undefined);
const mockSubscribe = jest.fn((handler: (msgs: unknown[]) => void) => {
  handler([]);
  return () => undefined;
});
const mockStartTutorial = jest.fn();

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => false),
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

jest.mock('../src/services/ChatService', () => ({
  __esModule: true,
  default: {
    sendMessage: (...args: unknown[]) => mockSendMessage(...args),
    subscribe: (...args: unknown[]) => mockSubscribe(...args),
  },
}));

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

describe('ChatScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat UI and sends message', () => {
    render(<ChatScreen />);

    expect(screen.getByText('CADDI_ASSISTANT')).toBeTruthy();
    expect(screen.getByText('HOW CAN I HELP YOU FOCUS TODAY?')).toBeTruthy();
    expect(screen.getByText('REPLAY GUIDE')).toBeTruthy();

    fireEvent.changeText(
      screen.getByPlaceholderText('TYPE_YOUR_THOUGHTS...'),
      'Hello',
    );
    fireEvent.press(screen.getByText('SEND'));

    expect(mockSendMessage).toHaveBeenCalledWith('Hello');
  });

  it('replays the shared chat guide from the header action', () => {
    render(<ChatScreen />);

    fireEvent.press(screen.getByTestId('chat-guide-button'));

    expect(mockStartTutorial).toHaveBeenCalledTimes(1);
  });
});
