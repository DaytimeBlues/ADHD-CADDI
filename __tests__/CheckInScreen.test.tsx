import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import CheckInScreen, {
  getRecommendationAction,
} from '../src/screens/CheckInScreen';

const mockRequestPendingStart = jest.fn();
const mockLoggerWarn = jest.fn();
const mockGetPersonalizedInsight = jest.fn();
const mockRecordCheckIn = jest.fn();

jest.mock('../src/services/ActivationService', () => ({
  __esModule: true,
  default: {
    requestPendingStart: (...args: unknown[]) =>
      mockRequestPendingStart(...args),
  },
}));

// Mock CheckInInsightService to prevent async fetch calls
jest.mock('../src/services/CheckInInsightService', () => ({
  __esModule: true,
  default: {
    getPersonalizedInsight: (...args: unknown[]) =>
      mockGetPersonalizedInsight(...args),
    recordCheckIn: (...args: unknown[]) => mockRecordCheckIn(...args),
  },
}));

jest.mock('../src/services/LoggerService', () => ({
  LoggerService: {
    warn: (...args: unknown[]) => mockLoggerWarn(...args),
  },
}));

jest.mock('../src/components/ui/LinearButton', () => ({
  LinearButton: ({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) => {
    const { Pressable, Text } = require('react-native');
    return (
      <Pressable onPress={onPress}>
        <Text>{title}</Text>
      </Pressable>
    );
  },
}));

describe('CheckInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestPendingStart.mockResolvedValue(undefined);
    mockGetPersonalizedInsight.mockResolvedValue(null);
    mockRecordCheckIn.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('maps high readiness to focus ignite action', () => {
    const action = getRecommendationAction(5, 5);
    expect(action.route).toBe('Focus');
    expect(action.cta).toBe('START IGNITE');
  });

  it('queues pending ignite start and navigates on high readiness CTA', async () => {
    const navigate = jest.fn();

    render(<CheckInScreen navigation={{ navigate }} />);

    fireEvent.press(screen.getByTestId('mood-option-5'));
    fireEvent.press(screen.getByTestId('energy-option-5'));

    await screen.findByText('START IGNITE');
    fireEvent.press(screen.getByTestId('recommendation-action-button'));

    expect(mockRequestPendingStart).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'checkin_prompt',
      }),
    );
    await waitFor(
      () => {
        expect(navigate).toHaveBeenCalledWith('Focus');
      },
      { timeout: 10000 },
    );
  }, 10000);

  it('still navigates to focus when pending start queue fails', async () => {
    const navigate = jest.fn();
    mockRequestPendingStart.mockRejectedValueOnce(new Error('storage down'));

    render(<CheckInScreen navigation={{ navigate }} />);

    fireEvent.press(screen.getByTestId('mood-option-5'));
    fireEvent.press(screen.getByTestId('energy-option-5'));

    await screen.findByText('START IGNITE');
    fireEvent.press(screen.getByTestId('recommendation-action-button'));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Focus');
    });
    expect(mockLoggerWarn).toHaveBeenCalledWith(
      expect.objectContaining({
        service: 'CheckInScreen',
        operation: 'handleRecommendationAction',
        message: 'Failed to queue pending ignite start from check-in',
        error: expect.any(Error),
      }),
    );
  });

  it('records completed check-ins before requesting personalized insight', async () => {
    render(<CheckInScreen navigation={{ navigate: jest.fn() }} />);

    fireEvent.press(screen.getByTestId('mood-option-4'));
    fireEvent.press(screen.getByTestId('energy-option-3'));

    await waitFor(() => {
      expect(mockRecordCheckIn).toHaveBeenCalledWith(
        expect.objectContaining({
          mood: 4,
          energy: 3,
          timestamp: expect.any(Number),
        }),
      );
    });
    expect(mockGetPersonalizedInsight).toHaveBeenCalled();
  });
});
