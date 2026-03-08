import type { SortedItem } from '../AISortService';

export const GOOGLE_TASKS_SCOPE = 'https://www.googleapis.com/auth/tasks';
export const GOOGLE_CALENDAR_SCOPE =
  'https://www.googleapis.com/auth/calendar.events';
export const GOOGLE_TASKS_INBOX_NAME = 'Spark Inbox';
export const MAX_PROCESSED_IDS = 500;
export const MAX_MARK_CONCURRENCY = 4;
export const MAX_EXPORT_CONCURRENCY = 4;
export const MAX_EXPORTED_FINGERPRINTS = 1000;

export const generateSyncItemId = (): string => {
  return `google-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const ensureStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
};

export const normalizeText = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ');
};

export const buildExportFingerprint = (item: SortedItem): string => {
  return [
    item.category,
    normalizeText(item.text).toLowerCase(),
    item.dueDate ?? '',
    item.start ?? '',
    item.end ?? '',
  ].join('|');
};
