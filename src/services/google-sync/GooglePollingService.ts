import NetInfo from '@react-native-community/netinfo';
import { LoggerService, withOperationContext } from '../LoggerService';
import { createOperationContext } from '../OperationContext';

interface GooglePollingServiceOptions {
  isWeb: boolean;
  syncToBrainDump: () => Promise<unknown>;
  processOfflineQueue: () => Promise<void>;
}

export class GooglePollingService {
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private netInfoUnsubscribe: (() => void) | null = null;

  constructor(private readonly options: GooglePollingServiceOptions) {}

  startForegroundPolling(intervalMs = 15 * 60 * 1000): void {
    if (this.options.isWeb || this.pollTimer) {
      return;
    }

    this.pollTimer = setInterval(() => {
      const operationContext = createOperationContext({
        feature: 'google-sync-polling',
      });
      this.options.syncToBrainDump().catch((error) => {
        LoggerService.error({
          ...withOperationContext(
            {
              service: 'GoogleTasksSyncService',
              operation: 'startForegroundPolling',
              message: 'Foreground Google Tasks poll failed',
              error,
            },
            operationContext,
          ),
        });
      });
    }, intervalMs);

    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
    }

    this.netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        return;
      }

      const operationContext = createOperationContext({
        feature: 'google-sync-polling',
      });
      LoggerService.info({
        ...withOperationContext(
          {
            service: 'GoogleTasksSyncService',
            operation: 'NetInfoListener',
            message:
              'Connection restored. Triggering sync and processing queue.',
          },
          operationContext,
        ),
      });
      this.options.syncToBrainDump().catch((error) => {
        LoggerService.warn({
          ...withOperationContext(
            {
              service: 'GoogleTasksSyncService',
              operation: 'NetInfoListener',
              message: 'Sync retry failed after connection restore.',
              error,
            },
            operationContext,
          ),
        });
      });
      this.options.processOfflineQueue().catch((error) => {
        LoggerService.warn({
          ...withOperationContext(
            {
              service: 'GoogleTasksSyncService',
              operation: 'NetInfoListener',
              message:
                'Offline queue processing failed after connection restore.',
              error,
            },
            operationContext,
          ),
        });
      });
    });

    NetInfo.fetch()
      .then((state) => {
        if (!state.isConnected) {
          return;
        }

        const operationContext = createOperationContext({
          feature: 'google-sync-polling',
        });
        this.options.processOfflineQueue().catch((error) => {
          LoggerService.warn({
            ...withOperationContext(
              {
                service: 'GoogleTasksSyncService',
                operation: 'startForegroundPolling',
                message: 'Startup offline queue processing failed.',
                error,
              },
              operationContext,
            ),
          });
        });
      })
      .catch((error) => {
        const operationContext = createOperationContext({
          feature: 'google-sync-polling',
        });
        LoggerService.warn({
          ...withOperationContext(
            {
              service: 'GoogleTasksSyncService',
              operation: 'startForegroundPolling',
              message: 'NetInfo fetch failed during polling startup.',
              error,
            },
            operationContext,
          ),
        });
      });
  }

  stopForegroundPolling(): void {
    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
      this.netInfoUnsubscribe = null;
    }

    if (!this.pollTimer) {
      return;
    }

    clearInterval(this.pollTimer);
    this.pollTimer = null;
  }
}
