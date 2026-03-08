import { SortedItem } from './AISortService';
import type {
  GoogleExportResult,
  GoogleTasksSyncResult,
} from './google-sync/types';

export type {
  GoogleExportResult,
  GoogleTasksSyncResult,
} from './google-sync/types';

class GoogleTasksSyncServiceClass {
  configureGoogleSignIn(): void {
    return;
  }

  async signInInteractive(): Promise<boolean> {
    return false;
  }

  async getCurrentUserScopes(): Promise<string[] | null> {
    return null;
  }

  async getCurrentUserEmail(): Promise<string | null> {
    return null;
  }

  async syncSortedItemsToGoogle(
    items: SortedItem[],
  ): Promise<GoogleExportResult> {
    return {
      createdTasks: 0,
      createdEvents: 0,
      skippedCount: items.length,
      authRequired: true,
      errorCode: 'auth_required',
      errorMessage: 'Google sign-in is not available on web yet.',
    };
  }

  async syncToBrainDump(): Promise<GoogleTasksSyncResult> {
    return {
      importedCount: 0,
      skippedCount: 0,
      markedCompletedCount: 0,
      syncTokenUpdated: false,
    };
  }

  startForegroundPolling(): void {
    return;
  }

  stopForegroundPolling(): void {
    return;
  }
}

export const GoogleTasksSyncService = new GoogleTasksSyncServiceClass();
export default GoogleTasksSyncService;
