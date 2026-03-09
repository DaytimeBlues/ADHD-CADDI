import type { SortedItem } from '../AISortService';
import type { GoogleApiError, GoogleTaskItem } from '../GoogleTasksApiClient';
import { GOOGLE_TASKS_INBOX_NAME, normalizeText } from './constants';
import type { GoogleExportResult } from './types';

export interface GoogleSyncApiClient {
  getTaskLists: (
    accessToken: string,
  ) => Promise<Array<{ id?: string; title?: string }>>;
  createTaskList: (accessToken: string, title: string) => Promise<string>;
  listTasks: (
    accessToken: string,
    listId: string,
    options: { syncToken?: string; pageToken?: string },
  ) => Promise<{
    items?: GoogleTaskItem[];
    nextPageToken?: string;
    nextSyncToken?: string;
  }>;
  createCalendarEvent: (
    accessToken: string,
    item: SortedItem,
  ) => Promise<boolean>;
  createTask: (
    accessToken: string,
    listId: string,
    item: SortedItem,
    listName: string,
  ) => Promise<boolean>;
  markTaskCompleted: (
    accessToken: string,
    listId: string,
    taskId: string,
  ) => Promise<boolean>;
}

export const isAuthError = (error: unknown): error is GoogleApiError =>
  error instanceof Error &&
  'status' in error &&
  ((error as GoogleApiError).status === 401 ||
    (error as GoogleApiError).status === 403);

export const toExportError = (
  error: unknown,
): {
  code: GoogleExportResult['errorCode'];
  message: string;
  authRequired: boolean;
} => {
  if (isAuthError(error)) {
    return {
      code: 'auth_failed',
      message:
        'Google authorization expired. Sign in again to continue Task/Calendar sync.',
      authRequired: true,
    };
  }

  if (error instanceof Error && 'status' in error) {
    const apiError = error as GoogleApiError;
    if (apiError.status === 429) {
      return {
        code: 'rate_limited',
        message: 'Google API rate limit reached. Try sync again in a moment.',
        authRequired: false,
      };
    }

    return {
      code: apiError.status === undefined ? 'network' : 'api_error',
      message:
        apiError.status === undefined
          ? 'Network issue while syncing with Google. Check your connection and retry.'
          : 'Google sync request failed. Try again shortly.',
      authRequired: false,
    };
  }

  if (error instanceof Error && error.message === 'GOOGLE_SYNC_TOKEN_EXPIRED') {
    return {
      code: 'api_error',
      message: 'Sync session expired. Retrying...',
      authRequired: false,
    };
  }

  return {
    code: 'api_error',
    message: 'Google sync failed unexpectedly. Try again shortly.',
    authRequired: false,
  };
};

export const ensureSparkInboxList = async (
  apiClient: GoogleSyncApiClient,
  accessToken: string,
): Promise<string> => {
  const lists = await apiClient.getTaskLists(accessToken);
  const existing = lists.find((list) => list.title === GOOGLE_TASKS_INBOX_NAME);
  if (existing?.id) {
    return existing.id;
  }

  return apiClient.createTaskList(accessToken, GOOGLE_TASKS_INBOX_NAME);
};

export const listDeltaTasks = async (
  apiClient: GoogleSyncApiClient,
  accessToken: string,
  listId: string,
  syncToken?: string,
): Promise<{ items: GoogleTaskItem[]; nextSyncToken?: string }> => {
  let pageToken: string | undefined;
  let nextSyncToken = syncToken;
  const allItems: GoogleTaskItem[] = [];

  do {
    const page = await apiClient.listTasks(accessToken, listId, {
      syncToken,
      pageToken,
    });

    if (Array.isArray(page.items)) {
      allItems.push(...page.items);
    }

    if (page.nextSyncToken) {
      nextSyncToken = page.nextSyncToken;
    }

    pageToken = page.nextPageToken;
  } while (pageToken);

  return { items: allItems, nextSyncToken };
};

export const delay = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const normalizeSortedItem = (item: SortedItem): SortedItem | null => {
  const normalizedTextValue = normalizeText(item.text);
  if (!normalizedTextValue) {
    return null;
  }

  return {
    ...item,
    text: normalizedTextValue,
  };
};
