import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import InboxScreen from '../src/screens/InboxScreen';

const mockPromote = jest.fn().mockResolvedValue(undefined);
const mockDiscard = jest.fn().mockResolvedValue(undefined);
const mockStartTutorial = jest.fn();
const mockGetAll = jest.fn().mockResolvedValue([
  {
    id: 'capture-1',
    source: 'text',
    status: 'unreviewed',
    raw: 'sample capture',
    createdAt: Date.now(),
  },
]);

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ goBack: jest.fn() }),
}));

jest.mock('../src/services/CaptureService', () => ({
  __esModule: true,
  default: {
    getAll: (...args: unknown[]) => mockGetAll(...args),
    promote: (...args: unknown[]) => mockPromote(...args),
    discard: (...args: unknown[]) => mockDiscard(...args),
    subscribe: (cb: () => void) => {
      cb();
      return () => undefined;
    },
  },
}));

jest.mock('../src/services/LoggerService', () => ({
  __esModule: true,
  LoggerService: { error: jest.fn() },
}));

jest.mock('../src/store/useTutorialStore', () => ({
  __esModule: true,
  inboxOnboardingFlow: {
    id: 'inbox-onboarding',
    steps: [{ id: 'inbox-intro', title: 'Inbox: Review captured items' }],
  },
  useTutorialStore: (
    selector: (state: {
      activeFlow: null;
      currentStepIndex: number;
      isVisible: boolean;
      onboardingCompleted: boolean;
      startTutorial: typeof mockStartTutorial;
      nextStep: jest.Mock;
      previousStep: jest.Mock;
      skipTutorial: jest.Mock;
    }) => unknown,
  ) =>
    selector({
      activeFlow: null,
      currentStepIndex: 0,
      isVisible: false,
      onboardingCompleted: true,
      startTutorial: mockStartTutorial,
      nextStep: jest.fn(),
      previousStep: jest.fn(),
      skipTutorial: jest.fn(),
    }),
}));

jest.mock('../src/components/tutorial/TutorialBubble', () => ({
  __esModule: true,
  TutorialBubble: () => null,
}));

jest.mock('../src/ui/cosmic', () => {
  const { View } = require('react-native');
  return {
    CosmicBackground: ({ children }: { children: React.ReactNode }) => (
      <View>{children}</View>
    ),
  };
});

describe('InboxScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAll.mockResolvedValue([
      {
        id: 'capture-1',
        source: 'text',
        status: 'unreviewed',
        raw: 'sample capture',
        createdAt: Date.now(),
      },
    ]);
  });

  it('renders list and handles promote/discard actions', async () => {
    render(<InboxScreen />);

    await waitFor(
      () => {
        expect(screen.getByTestId('capture-row-capture-1')).toBeTruthy();
      },
      { timeout: 10000 },
    );

    fireEvent.press(screen.getByTestId('promote-task-capture-1'));
    expect(mockPromote).toHaveBeenCalledWith('capture-1', 'task');

    fireEvent.press(screen.getByTestId('discard-capture-1'));
    expect(mockDiscard).toHaveBeenCalledWith('capture-1');
  }, 10000);

  it('offers a replay guide action for inbox triage', async () => {
    render(<InboxScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('inbox-guide-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('inbox-guide-button'));
    expect(mockStartTutorial).toHaveBeenCalled();
  });
});
