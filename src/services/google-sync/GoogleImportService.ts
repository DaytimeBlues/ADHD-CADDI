import NetInfo from '@react-native-community/netinfo';
import OverlayService from '../OverlayService';
import StorageService from '../StorageService';
import { LoggerService, withOperationContext } from '../LoggerService';
import { createOperationContext } from '../OperationContext';
import { generateSyncItemId, MAX_MARK_CONCURRENCY } from './constants';
import {
  getProcessedIds,
  readSyncState,
  setProcessedIds,
  writeSyncState,
} from './storage';
import {
  delay,
  ensureSparkInboxList,
  listDeltaTasks,
  type GoogleSyncApiClient,
} from './GoogleSyncSupport';
import type {
  BrainDumpItem,
  GoogleTasksSyncResult,
  GoogleTasksSyncState,
} from './types';

interface GoogleImportServiceOptions {
  authService: { getAccessToken: () => Promise<string | null> };
  apiClient: GoogleSyncApiClient;
  getIsSyncing: () => boolean;
  setIsSyncing: (value: boolean) => void;
  maxSyncRetries?: number;
  baseRetryDelayMs?: number;
}

export class GoogleImportService {
  private readonly maxSyncRetries: number;
  private readonly baseRetryDelayMs: number;

  constructor(private readonly options: GoogleImportServiceOptions) {
    this.maxSyncRetries = options.maxSyncRetries ?? 3;
    this.baseRetryDelayMs = options.baseRetryDelayMs ?? 2000;
  }

  async syncToBrainDump(
    retryCount = 0,
    operationContext = createOperationContext({
      feature: 'google-sync-import',
    }),
  ): Promise<GoogleTasksSyncResult> {
    const result: GoogleTasksSyncResult = {
      importedCount: 0,
      skippedCount: 0,
      markedCompletedCount: 0,
      syncTokenUpdated: false,
    };

    if (this.options.getIsSyncing()) {
      return result;
    }

    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      LoggerService.info({
        ...withOperationContext(
          {
            service: 'GoogleTasksSyncService',
            operation: 'syncToBrainDump',
            message: 'Sync skipped: device is offline',
          },
          operationContext,
        ),
      });
      return result;
    }

    this.options.setIsSyncing(true);
    try {
      const accessToken = await this.options.authService.getAccessToken();
      if (!accessToken) {
        return result;
      }

      const syncState = await readSyncState();
      const listId =
        syncState.listId ||
        (await ensureSparkInboxList(this.options.apiClient, accessToken));

      let delta;
      try {
        delta = await listDeltaTasks(
          this.options.apiClient,
          accessToken,
          listId,
          syncState.syncToken,
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'GOOGLE_SYNC_TOKEN_EXPIRED'
        ) {
          delta = await listDeltaTasks(
            this.options.apiClient,
            accessToken,
            listId,
          );
        } else {
          throw error;
        }
      }

      const existingItems =
        (await StorageService.getJSON<BrainDumpItem[]>(
          StorageService.STORAGE_KEYS.brainDump,
        )) || [];
      const processedSet = new Set(await getProcessedIds());
      const existingGoogleTaskIds = new Set(
        existingItems
          .map((item) => item.googleTaskId)
          .filter((taskId): taskId is string => typeof taskId === 'string'),
      );

      const pendingMarks: string[] = [];
      const importedItems: BrainDumpItem[] = [];

      for (const task of delta.items) {
        const title = task.title?.trim();
        if (!task.id || !title || task.deleted || task.status === 'completed') {
          result.skippedCount += 1;
          continue;
        }

        if (processedSet.has(task.id) || existingGoogleTaskIds.has(task.id)) {
          result.skippedCount += 1;
          continue;
        }

        importedItems.push({
          id: generateSyncItemId(),
          text: task.notes ? `${title}\n\n${task.notes}` : title,
          createdAt: task.updated || new Date().toISOString(),
          source: 'google',
          googleTaskId: task.id,
        });
        pendingMarks.push(task.id);
      }

      if (importedItems.length > 0) {
        const nextItems = [...importedItems, ...existingItems];
        await StorageService.setJSON(
          StorageService.STORAGE_KEYS.brainDump,
          nextItems,
        );
        OverlayService.updateCount(nextItems.length);
        result.importedCount = importedItems.length;
      }

      for (
        let index = 0;
        index < pendingMarks.length;
        index += MAX_MARK_CONCURRENCY
      ) {
        const chunk = pendingMarks.slice(index, index + MAX_MARK_CONCURRENCY);
        const markResults = await Promise.all(
          chunk.map((taskId) =>
            this.options.apiClient.markTaskCompleted(
              accessToken,
              listId,
              taskId,
            ),
          ),
        );

        markResults.forEach((marked: boolean, chunkIndex: number) => {
          if (marked) {
            const taskId = chunk[chunkIndex];
            result.markedCompletedCount += 1;
            processedSet.add(taskId);
          }
        });
      }

      await setProcessedIds(Array.from(processedSet));

      const nextState: GoogleTasksSyncState = {
        listId,
        syncToken: delta.nextSyncToken,
      };

      await writeSyncState(nextState);
      if (delta.nextSyncToken && delta.nextSyncToken !== syncState.syncToken) {
        result.syncTokenUpdated = true;
      }

      await StorageService.set(
        StorageService.STORAGE_KEYS.googleTasksLastSyncAt,
        new Date().toISOString(),
      );

      return result;
    } catch (error) {
      LoggerService.error({
        ...withOperationContext(
          {
            service: 'GoogleTasksSyncService',
            operation: 'syncToBrainDump',
            message: `Sync failed (attempt ${retryCount + 1})`,
            error,
          },
          operationContext,
        ),
      });

      if (retryCount < this.maxSyncRetries) {
        const backoffDelay = this.baseRetryDelayMs * Math.pow(2, retryCount);
        await delay(backoffDelay);
        return this.syncToBrainDump(retryCount + 1, operationContext);
      }
      throw error;
    } finally {
      this.options.setIsSyncing(false);
    }
  }
}
