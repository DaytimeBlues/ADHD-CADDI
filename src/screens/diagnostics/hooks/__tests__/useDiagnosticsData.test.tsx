import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useDiagnosticsData } from '../useDiagnosticsData';

const mockPlatformState = {
  isWeb: false,
  isAndroid: true,
  isIOS: false,
};

const mockStorageGet = jest.fn();
const mockStorageGetJSON = jest.fn();
const mockGetCurrentUserScopes = jest.fn();
const mockGetCurrentUserEmail = jest.fn();

jest.mock('../../../../utils/PlatformUtils', () => ({
  get isWeb() {
    return mockPlatformState.isWeb;
  },
  get isAndroid() {
    return mockPlatformState.isAndroid;
  },
  get isIOS() {
    return mockPlatformState.isIOS;
  },
}));

jest.mock('../../../../config', () => ({
  config: {
    googleWebClientId: 'web-client-id',
    googleIosClientId: 'ios-client-id',
  },
}));

jest.mock('../../../../services/StorageService', () => ({
  __esModule: true,
  default: {
    STORAGE_KEYS: {
      googleTasksLastSyncAt: 'googleTasksLastSyncAt',
      googleTasksExportedFingerprints: 'googleTasksExportedFingerprints',
    },
    get: (...args: unknown[]) => mockStorageGet(...args),
    getJSON: (...args: unknown[]) => mockStorageGetJSON(...args),
  },
}));

jest.mock('../../../../services/GoogleTasksSyncService', () => ({
  __esModule: true,
  GoogleTasksSyncService: {
    getCurrentUserScopes: (...args: unknown[]) =>
      mockGetCurrentUserScopes(...args),
    getCurrentUserEmail: (...args: unknown[]) =>
      mockGetCurrentUserEmail(...args),
  },
}));

describe('useDiagnosticsData', () => {
  let latest: ReturnType<typeof useDiagnosticsData> | null = null;

  const HookHost = () => {
    latest = useDiagnosticsData();
    return null;
  };

  const getLatest = () => {
    if (!latest) {
      throw new Error('Hook state not available');
    }
    return latest;
  };

  const findEntry = (label: string) => {
    return getLatest().diagnostics.find((entry) => entry.label === label);
  };

  beforeEach(() => {
    mockPlatformState.isWeb = false;
    mockPlatformState.isAndroid = true;
    mockPlatformState.isIOS = false;

    mockStorageGet.mockResolvedValue(
      new Date(Date.now() - 10 * 60000).toISOString(),
    );
    mockStorageGetJSON.mockResolvedValue(['a', 'b', 'c']);
    mockGetCurrentUserScopes.mockResolvedValue([
      'https://www.googleapis.com/auth/tasks',
      'https://www.googleapis.com/auth/calendar.events',
    ]);
    mockGetCurrentUserEmail.mockResolvedValue('user@example.com');
  });

  afterEach(() => {
    latest = null;
    jest.clearAllMocks();
  });

  it('loads auth scopes, email, and storage diagnostics', async () => {
    render(<HookHost />);

    await waitFor(() => {
      expect(getLatest().isRefreshing).toBe(false);
      expect(getLatest().diagnostics.length).toBeGreaterThan(0);
    });

    expect(findEntry('Google Tasks Scope')?.value).toBe('Granted');
    expect(findEntry('Google Calendar Scope')?.value).toBe('Granted');
    expect(findEntry('Signed In User')?.value).toBe('user@example.com');
    expect(findEntry('Exported Items (Dedupe Cache)')?.value).toBe('3');
  });

  it('reports not signed in when no user scopes are available', async () => {
    mockGetCurrentUserScopes.mockResolvedValue(null);

    render(<HookHost />);

    await waitFor(() => {
      expect(getLatest().isRefreshing).toBe(false);
      expect(findEntry('Google Auth Status')?.value).toBe('Not signed in');
    });
  });

  it('handles last sync and cache errors', async () => {
    mockStorageGet.mockRejectedValue(new Error('read error'));
    mockStorageGetJSON.mockRejectedValue(new Error('cache error'));

    render(<HookHost />);

    await waitFor(() => {
      expect(getLatest().isRefreshing).toBe(false);
      expect(findEntry('Last Sync')?.value).toBe('Error reading timestamp');
      expect(findEntry('Exported Items')?.value).toBe('Error reading cache');
    });
  });

  it('reports web limitations when running on web', async () => {
    mockPlatformState.isWeb = true;
    mockPlatformState.isAndroid = false;

    render(<HookHost />);

    await waitFor(() => {
      expect(getLatest().isRefreshing).toBe(false);
      expect(findEntry('Google Sync')?.value).toBe('Not available on web');
    });

    expect(mockGetCurrentUserScopes).not.toHaveBeenCalled();
  });
});
