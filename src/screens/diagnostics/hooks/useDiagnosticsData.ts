import { useCallback, useEffect, useState } from 'react';
import { config } from '../../../config';
import { GoogleTasksSyncService } from '../../../services/GoogleTasksSyncService';
import StorageService from '../../../services/StorageService';
import { isAndroid, isIOS, isWeb } from '../../../utils/PlatformUtils';
import type { DiagnosticEntry } from '../types';

export type UseDiagnosticsDataResult = {
  diagnostics: DiagnosticEntry[];
  isRefreshing: boolean;
  refreshDiagnostics: () => Promise<void>;
};

export const useDiagnosticsData = (): UseDiagnosticsDataResult => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticEntry[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshDiagnostics = useCallback(async () => {
    setIsRefreshing(true);
    const entries: DiagnosticEntry[] = [];

    try {
      entries.push({
        label: 'Platform',
        value: isWeb
          ? 'web'
          : isAndroid
            ? 'android'
            : isIOS
              ? 'ios'
              : 'unknown',
        status: 'info',
      });

      const hasWebClientId = Boolean(config.googleWebClientId);
      const hasIosClientId = Boolean(config.googleIosClientId);
      const hasAnyConfig = hasWebClientId || hasIosClientId;

      entries.push({
        label: 'Google Web Client ID',
        value: hasWebClientId ? 'Configured' : 'Missing',
        status: hasWebClientId ? 'ok' : 'warning',
      });

      entries.push({
        label: 'Google iOS Client ID',
        value: hasIosClientId ? 'Configured' : 'Missing',
        status: hasIosClientId ? 'ok' : 'warning',
      });

      if (!isWeb) {
        try {
          entries.push({
            label: 'Can Attempt Auth',
            value: hasAnyConfig ? 'Yes' : 'No (missing client IDs)',
            status: hasAnyConfig ? 'ok' : 'error',
          });

          const scopes = await GoogleTasksSyncService.getCurrentUserScopes();
          if (scopes) {
            const hasTasksScope = scopes.includes(
              'https://www.googleapis.com/auth/tasks',
            );
            const hasCalendarScope = scopes.includes(
              'https://www.googleapis.com/auth/calendar.events',
            );

            entries.push({
              label: 'Google Tasks Scope',
              value: hasTasksScope ? 'Granted' : 'Not granted',
              status: hasTasksScope ? 'ok' : 'warning',
            });

            entries.push({
              label: 'Google Calendar Scope',
              value: hasCalendarScope ? 'Granted' : 'Not granted',
              status: hasCalendarScope ? 'ok' : 'warning',
            });

            const signedInEmail =
              await GoogleTasksSyncService.getCurrentUserEmail();
            entries.push({
              label: 'Signed In User',
              value: signedInEmail || 'Unknown',
              status: 'info',
            });
          } else {
            entries.push({
              label: 'Google Auth Status',
              value: 'Not signed in',
              status: 'warning',
            });
          }
        } catch (error) {
          entries.push({
            label: 'Auth Check Error',
            value: error instanceof Error ? error.message : 'Unknown error',
            status: 'error',
          });
        }
      } else {
        entries.push({
          label: 'Google Sync',
          value: 'Not available on web',
          status: 'info',
        });
      }

      try {
        const lastSyncAt = await StorageService.get(
          StorageService.STORAGE_KEYS.googleTasksLastSyncAt,
        );

        if (lastSyncAt) {
          const date = new Date(lastSyncAt);
          const ageMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
          entries.push({
            label: 'Last Sync',
            value: `${ageMinutes} minutes ago (${date.toLocaleString()})`,
            status: ageMinutes < 30 ? 'ok' : 'warning',
          });
        } else {
          entries.push({
            label: 'Last Sync',
            value: 'Never',
            status: 'info',
          });
        }
      } catch {
        entries.push({
          label: 'Last Sync',
          value: 'Error reading timestamp',
          status: 'error',
        });
      }

      try {
        const fingerprints = await StorageService.getJSON(
          StorageService.STORAGE_KEYS.googleTasksExportedFingerprints,
        );
        const count = Array.isArray(fingerprints) ? fingerprints.length : 0;
        entries.push({
          label: 'Exported Items (Dedupe Cache)',
          value: `${count}`,
          status: 'info',
        });
      } catch {
        entries.push({
          label: 'Exported Items',
          value: 'Error reading cache',
          status: 'error',
        });
      }

      setDiagnostics(entries);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refreshDiagnostics().catch(() => {
      setIsRefreshing(false);
    });
  }, [refreshDiagnostics]);

  return {
    diagnostics,
    isRefreshing,
    refreshDiagnostics,
  };
};

export default useDiagnosticsData;
