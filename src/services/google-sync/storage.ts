import StorageService from '../StorageService';
import {
  ensureStringArray,
  MAX_EXPORTED_FINGERPRINTS,
  MAX_PROCESSED_IDS,
} from './constants';
import type { GoogleTasksSyncState } from './types';

export const readSyncState = async (): Promise<GoogleTasksSyncState> => {
  const state = await StorageService.getJSON<GoogleTasksSyncState>(
    StorageService.STORAGE_KEYS.googleTasksSyncState,
  );

  if (!state || typeof state !== 'object') {
    return {};
  }

  return {
    listId: typeof state.listId === 'string' ? state.listId : undefined,
    syncToken:
      typeof state.syncToken === 'string' ? state.syncToken : undefined,
  };
};

export const writeSyncState = async (
  nextState: GoogleTasksSyncState,
): Promise<void> => {
  await StorageService.setJSON(
    StorageService.STORAGE_KEYS.googleTasksSyncState,
    nextState,
  );
};

export const getProcessedIds = async (): Promise<string[]> => {
  const value = await StorageService.getJSON<unknown>(
    StorageService.STORAGE_KEYS.googleTasksProcessedIds,
  );
  return ensureStringArray(value);
};

export const setProcessedIds = async (ids: string[]): Promise<void> => {
  const unique = Array.from(new Set(ids)).slice(-MAX_PROCESSED_IDS);
  await StorageService.setJSON(
    StorageService.STORAGE_KEYS.googleTasksProcessedIds,
    unique,
  );
};

export const getExportedFingerprints = async (): Promise<string[]> => {
  const value = await StorageService.getJSON<unknown>(
    StorageService.STORAGE_KEYS.googleTasksExportedFingerprints,
  );
  return ensureStringArray(value);
};

export const setExportedFingerprints = async (
  fingerprints: string[],
): Promise<void> => {
  const unique = Array.from(new Set(fingerprints)).slice(
    -MAX_EXPORTED_FINGERPRINTS,
  );
  await StorageService.setJSON(
    StorageService.STORAGE_KEYS.googleTasksExportedFingerprints,
    unique,
  );
};
