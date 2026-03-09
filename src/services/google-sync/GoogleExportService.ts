import NetInfo from '@react-native-community/netinfo';
import { LoggerService, withOperationContext } from '../LoggerService';
import type { SortedItem } from '../AISortService';
import { createOperationContext } from '../OperationContext';
import {
  buildExportFingerprint,
  GOOGLE_TASKS_INBOX_NAME,
  MAX_EXPORT_CONCURRENCY,
} from './constants';
import { getExportedFingerprints, setExportedFingerprints } from './storage';
import {
  ensureSparkInboxList,
  normalizeSortedItem,
  toExportError,
  type GoogleSyncApiClient,
} from './GoogleSyncSupport';
import type { GoogleExportResult } from './types';

interface GoogleExportServiceOptions {
  authService: { getAccessToken: () => Promise<string | null> };
  apiClient: GoogleSyncApiClient;
  isWeb: boolean;
  queueOfflineItems: (items: SortedItem[]) => void;
}

export class GoogleExportService {
  constructor(private readonly options: GoogleExportServiceOptions) {}

  async syncSortedItemsToGoogle(
    items: SortedItem[],
    operationContext = createOperationContext({
      feature: 'google-sync-export',
    }),
  ): Promise<GoogleExportResult> {
    const result: GoogleExportResult = {
      createdTasks: 0,
      createdEvents: 0,
      skippedCount: 0,
      authRequired: false,
    };

    if (items.length === 0 || this.options.isWeb) {
      result.skippedCount = items.length;
      return result;
    }

    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      LoggerService.info({
        ...withOperationContext(
          {
            service: 'GoogleTasksSyncService',
            operation: 'syncSortedItemsToGoogle',
            message: 'Device offline. Queuing items for export.',
          },
          operationContext,
        ),
      });
      this.options.queueOfflineItems(items);
      result.skippedCount = items.length;
      result.errorCode = 'network';
      return result;
    }

    const accessToken = await this.options.authService.getAccessToken();
    if (!accessToken) {
      result.authRequired = true;
      result.errorCode = 'auth_required';
      result.errorMessage =
        'Google sign-in required to sync Tasks and Calendar exports.';
      result.skippedCount = items.length;
      return result;
    }

    let listId: string;
    try {
      listId = await ensureSparkInboxList(this.options.apiClient, accessToken);
    } catch (error) {
      const exportError = toExportError(error);
      result.authRequired = exportError.authRequired;
      result.errorCode = exportError.code;
      result.errorMessage = exportError.message;
      result.skippedCount = items.length;
      return result;
    }

    const exportedSet = new Set(await getExportedFingerprints());

    for (let index = 0; index < items.length; index += MAX_EXPORT_CONCURRENCY) {
      const chunk = items.slice(index, index + MAX_EXPORT_CONCURRENCY);
      await Promise.allSettled(
        chunk.map(async (item) => {
          const fingerprint = buildExportFingerprint(item);
          if (exportedSet.has(fingerprint)) {
            result.skippedCount += 1;
            return;
          }

          const normalizedItem = normalizeSortedItem(item);
          if (!normalizedItem) {
            result.skippedCount += 1;
            return;
          }

          if (normalizedItem.category === 'event') {
            const eventCreated =
              await this.options.apiClient.createCalendarEvent(
                accessToken,
                normalizedItem,
              );

            if (eventCreated) {
              result.createdEvents += 1;
              exportedSet.add(fingerprint);
              return;
            }

            const fallbackTaskCreated = await this.options.apiClient.createTask(
              accessToken,
              listId,
              normalizedItem,
              GOOGLE_TASKS_INBOX_NAME,
            );
            if (fallbackTaskCreated) {
              result.createdTasks += 1;
              exportedSet.add(fingerprint);
            } else {
              result.skippedCount += 1;
            }
            return;
          }

          if (
            normalizedItem.category === 'task' ||
            normalizedItem.category === 'reminder'
          ) {
            const taskCreated = await this.options.apiClient.createTask(
              accessToken,
              listId,
              normalizedItem,
              GOOGLE_TASKS_INBOX_NAME,
            );
            if (taskCreated) {
              result.createdTasks += 1;
              exportedSet.add(fingerprint);
            } else {
              result.skippedCount += 1;
            }
            return;
          }

          result.skippedCount += 1;
        }),
      );
    }

    await setExportedFingerprints(Array.from(exportedSet));
    return result;
  }
}
