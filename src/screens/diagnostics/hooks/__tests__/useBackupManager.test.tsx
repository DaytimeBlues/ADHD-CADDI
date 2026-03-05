import React from 'react';
import { act, render } from '@testing-library/react-native';
import { AccessibilityInfo, Alert, NativeModules } from 'react-native';
import { useBackupManager } from '../useBackupManager';

const mockPlatformState = {
  isWeb: true,
};

const mockStorageGet = jest.fn();
const mockStorageSet = jest.fn();
const mockStorageRemove = jest.fn();

jest.mock('../../../../utils/PlatformUtils', () => ({
  get isWeb() {
    return mockPlatformState.isWeb;
  },
  get isAndroid() {
    return !mockPlatformState.isWeb;
  },
  isIOS: false,
}));

jest.mock('../../../../services/StorageService', () => ({
  __esModule: true,
  default: {
    STORAGE_KEYS: {
      tasks: 'tasks',
      brainDump: 'brainDump',
      googleTasksLastSyncAt: 'googleTasksLastSyncAt',
      googleTasksExportedFingerprints: 'googleTasksExportedFingerprints',
      backupLastExportAt: 'backupLastExportAt',
    },
    get: (...args: unknown[]) => mockStorageGet(...args),
    set: (...args: unknown[]) => mockStorageSet(...args),
    remove: (...args: unknown[]) => mockStorageRemove(...args),
  },
}));

describe('useBackupManager', () => {
  let announceSpy: ReturnType<typeof jest.spyOn>;
  let alertSpy: ReturnType<typeof jest.spyOn>;

  const mockOnImported = jest.fn(async () => undefined);

  let latest: ReturnType<typeof useBackupManager> | null = null;

  const HookHost = () => {
    latest = useBackupManager({ onImported: mockOnImported });
    return null;
  };

  const getLatest = () => {
    if (!latest) {
      throw new Error('Hook state not available');
    }
    return latest;
  };

  beforeEach(() => {
    mockPlatformState.isWeb = true;
    mockOnImported.mockResolvedValue(undefined);

    mockStorageGet.mockImplementation(async (key: string) => {
      const values: Record<string, string | null> = {
        tasks: 'task-data',
        brainDump: null,
        googleTasksLastSyncAt: null,
        googleTasksExportedFingerprints: null,
        backupLastExportAt: null,
      };
      return values[key] ?? null;
    });
    mockStorageSet.mockResolvedValue({ success: true });
    mockStorageRemove.mockResolvedValue({ success: true });

    (NativeModules as { Clipboard?: { setString?: jest.Mock } }).Clipboard = {
      setString: jest.fn(),
    };

    announceSpy = jest
      .spyOn(AccessibilityInfo, 'announceForAccessibility')
      .mockImplementation(jest.fn());
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    latest = null;
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('reports invalid JSON during import', async () => {
    render(<HookHost />);

    act(() => {
      getLatest().setBackupJson('{invalid json');
    });

    await act(async () => {
      await getLatest().importBackup();
    });

    expect(getLatest().backupStatus).toBe('Invalid JSON. Import canceled.');
    expect(announceSpy).toHaveBeenCalledWith('Invalid JSON. Import canceled.');
  });

  it('imports in overwrite and merge modes correctly', async () => {
    render(<HookHost />);

    const overwritePayload = JSON.stringify({
      schema: 'spark-backup-v1',
      exportedAt: '2026-03-05T00:00:00.000Z',
      app: 'spark-adhd',
      data: {
        tasks: 'imported-tasks',
        brainDump: null,
      },
    });

    act(() => {
      getLatest().setBackupJson(overwritePayload);
    });

    await act(async () => {
      await getLatest().importBackup();
    });

    expect(mockStorageSet).toHaveBeenCalledWith('tasks', 'imported-tasks');
    expect(mockStorageRemove).toHaveBeenCalledWith('brainDump');
    expect(mockOnImported).toHaveBeenCalledTimes(1);

    mockStorageSet.mockClear();
    mockStorageRemove.mockClear();

    act(() => {
      getLatest().setImportMode('merge');
      getLatest().setBackupJson(overwritePayload);
    });

    await act(async () => {
      await getLatest().importBackup();
    });

    expect(mockStorageSet).toHaveBeenCalledWith('tasks', 'imported-tasks');
    expect(mockStorageRemove).not.toHaveBeenCalled();
  });

  it('exports backup JSON and stores last export timestamp', async () => {
    render(<HookHost />);

    await act(async () => {
      await getLatest().exportBackup();
    });

    const payload = JSON.parse(getLatest().backupJson) as {
      schema: string;
      app: string;
      exportedAt: string;
    };

    expect(payload.schema).toBe('spark-backup-v1');
    expect(payload.app).toBe('spark-adhd');
    expect(getLatest().lastBackupExportAt).toBe(payload.exportedAt);
    expect(mockStorageSet).toHaveBeenCalledWith(
      'backupLastExportAt',
      payload.exportedAt,
    );
    expect(
      (NativeModules as { Clipboard?: { setString?: jest.Mock } }).Clipboard
        ?.setString,
    ).toHaveBeenCalledWith(getLatest().backupJson);
  });

  it('uses confirmation alert for native import flow', async () => {
    mockPlatformState.isWeb = false;
    render(<HookHost />);

    act(() => {
      getLatest().setBackupJson(
        JSON.stringify({
          schema: 'spark-backup-v1',
          exportedAt: '2026-03-05T00:00:00.000Z',
          app: 'spark-adhd',
          data: { tasks: 'imported-tasks', brainDump: null },
        }),
      );
    });

    await act(async () => {
      await getLatest().importBackup();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Import backup?',
      'This overwrites local app data for tracked keys. Continue?',
      expect.any(Array),
      { cancelable: true },
    );
  });
});
