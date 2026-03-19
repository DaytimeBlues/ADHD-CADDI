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

// Global navigation mock — BackHeader.tsx calls useNavigation() unconditionally,
// so every screen test needs this available even without a NavigationContainer wrapper.
export const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
  canGoBack: jest.fn(() => true),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => () => undefined),
  isFocused: jest.fn(() => true),
};

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => mockNavigation,
    useRoute: () => ({ key: 'test', name: 'Test' }),
  };
});

// Prevent open handles from lingering timers/intervals (TimerService, CheckInService, etc.)
afterEach(() => {
  jest.clearAllTimers();
});

afterAll(() => {
  jest.useRealTimers();
});
