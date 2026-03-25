import { LoggerService } from './LoggerService';

type BasicStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const fallbackStorage = new Map<string, string>();

const memoryStorage: BasicStorage = {
  getItem: (key) => fallbackStorage.get(key) ?? null,
  setItem: (key, value) => {
    fallbackStorage.set(key, value);
  },
  removeItem: (key) => {
    fallbackStorage.delete(key);
  },
};

const getStorage = (): BasicStorage => {
  if (
    typeof globalThis !== 'undefined' &&
    'localStorage' in globalThis &&
    globalThis.localStorage
  ) {
    return globalThis.localStorage;
  }

  return memoryStorage;
};

const STORAGE_VERSION = 1;
const STORAGE_VERSION_KEY = 'storageVersion';

const STORAGE_KEYS = {
  streakCount: 'streakCount',
  lastUseDate: 'lastUseDate',
  theme: 'theme',
  tasks: 'tasks',
  brainDump: 'brainDump',
  igniteState: 'igniteState',
  pomodoroState: 'pomodoroState',
  firstSuccessGuideState: 'firstSuccessGuideState',
  uxMetricsEvents: 'uxMetricsEvents',
  activationSessions: 'activationSessions',
  activationPendingStart: 'activationPendingStart',
  lastActiveSession: 'lastActiveSession',
  checkInHistory: 'checkInHistory',
  retentionGraceWindowStart: 'retentionGraceWindowStart',
  retentionGraceDaysUsed: 'retentionGraceDaysUsed',
  googleTasksSyncState: 'googleTasksSyncState',
  googleTasksProcessedIds: 'googleTasksProcessedIds',
  googleTasksLastSyncAt: 'googleTasksLastSyncAt',
  googleTasksExportedFingerprints: 'googleTasksExportedFingerprints',
  backupLastExportAt: 'backupLastExportAt',
  captureInbox: 'captureInbox',
  isBiometricSecured: 'isBiometricSecured',
} as const;

const safeJSONParse = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    LoggerService.warn({
      service: 'StorageService',
      operation: 'safeJSONParse',
      message: 'Failed to parse JSON, returning null',
      error,
    });
    return null;
  }
};

let initPromise: Promise<void> | null = null;
let isInitialized = false;

const runMigrations = async (): Promise<void> => {
  try {
    const storedVersion = getStorage().getItem(STORAGE_VERSION_KEY);
    const currentVersion = storedVersion ? parseInt(storedVersion, 10) : 0;

    if (currentVersion < STORAGE_VERSION) {
      getStorage().setItem(STORAGE_VERSION_KEY, STORAGE_VERSION.toString());
    }
  } catch (error) {
    LoggerService.error({
      service: 'StorageService',
      operation: 'runMigrations',
      message: 'Storage migration error',
      error,
    });
  }
};

const ensureInitialized = async (): Promise<void> => {
  if (isInitialized) {
    return;
  }

  if (!initPromise) {
    initPromise = runMigrations().finally(() => {
      isInitialized = true;
      initPromise = null;
    });
  }

  await initPromise;
};

const StorageService = {
  async init(): Promise<void> {
    await ensureInitialized();
  },

  async get(key: string): Promise<string | null> {
    try {
      await ensureInitialized();
      return getStorage().getItem(key);
    } catch (error) {
      LoggerService.error({
        service: 'StorageService',
        operation: 'get',
        message: 'Storage get error (localStorage)',
        error,
        context: { key },
      });
      return null;
    }
  },

  async set(
    key: string,
    value: string,
  ): Promise<{ success: boolean; error?: unknown }> {
    try {
      await ensureInitialized();
      getStorage().setItem(key, value);
      return { success: true };
    } catch (error) {
      LoggerService.error({
        service: 'StorageService',
        operation: 'set',
        message: 'Storage set error (localStorage)',
        error,
        context: { key },
      });
      return { success: false, error };
    }
  },

  async remove(key: string): Promise<{ success: boolean; error?: unknown }> {
    try {
      await ensureInitialized();
      getStorage().removeItem(key);
      return { success: true };
    } catch (error) {
      LoggerService.error({
        service: 'StorageService',
        operation: 'remove',
        message: 'Storage remove error (localStorage)',
        error,
        context: { key },
      });
      return { success: false, error };
    }
  },

  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key);
      return safeJSONParse<T>(value);
    } catch (error) {
      LoggerService.error({
        service: 'StorageService',
        operation: 'getJSON',
        message: 'Storage getJSON error',
        error,
        context: { key },
      });
      return null;
    }
  },

  async setJSON<T>(key: string, value: T): Promise<boolean> {
    try {
      const result = await this.set(key, JSON.stringify(value));
      return result.success;
    } catch (error) {
      LoggerService.error({
        service: 'StorageService',
        operation: 'setJSON',
        message: 'Storage setJSON error',
        error,
        context: { key },
      });
      return false;
    }
  },

  STORAGE_KEYS,
};

export const zustandStorage = {
  getItem: (name: string): Promise<string | null> => {
    return StorageService.get(name);
  },
  setItem: (name: string, value: string): Promise<void> => {
    return StorageService.set(name, value).then((result) => {
      if (!result.success) {
        throw result.error || new Error(`Failed to set item: ${name}`);
      }
    });
  },
  removeItem: (name: string): Promise<void> => {
    return StorageService.remove(name).then((result) => {
      if (!result.success) {
        throw result.error || new Error(`Failed to remove item: ${name}`);
      }
    });
  },
};

export default StorageService;
