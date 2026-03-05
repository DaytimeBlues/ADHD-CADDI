import '@testing-library/react-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

type NetInfoState = {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  details: null;
};

const netInfoState: NetInfoState = {
  isConnected: true,
  isInternetReachable: true,
  type: 'wifi',
  details: null,
};

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    fetch: jest.fn(async () => netInfoState),
    addEventListener: jest.fn((listener: (state: NetInfoState) => void) => {
      listener(netInfoState);
      return () => undefined;
    }),
  },
  useNetInfo: jest.fn(() => netInfoState),
}));

// Prevent open handles from lingering timers/intervals (TimerService, CheckInService, etc.)
afterEach(() => {
  jest.clearAllTimers();
});

afterAll(() => {
  jest.useRealTimers();
});
