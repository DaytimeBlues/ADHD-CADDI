import type { User } from '@firebase/auth';
import StorageService from './StorageService';
import { useCaptureStore } from '../store/useCaptureStore';
import { useTaskStore } from '../store/useTaskStore';

const GUEST_SESSION_STORAGE_KEY = 'guestSession';

export interface GuestSessionRecord {
  id: string;
  seedDemoData: boolean;
  createdAt: number;
}

const buildPersistedTaskStore = (
  tasks: ReturnType<typeof useTaskStore.getState>['tasks'],
) =>
  JSON.stringify({
    state: {
      tasks,
      _hasHydrated: true,
    },
    version: 0,
  });

const buildPersistedCaptureStore = (
  items: ReturnType<typeof useCaptureStore.getState>['items'],
) =>
  JSON.stringify({
    state: {
      items,
      _hasHydrated: true,
    },
    version: 0,
  });

const seedGuestDemoData = async () => {
  const taskState = useTaskStore.getState();
  const captureState = useCaptureStore.getState();

  if (taskState.tasks.length === 0) {
    const now = Date.now();
    await StorageService.set(
      'taskStore',
      buildPersistedTaskStore([
        {
          id: 'demo-task-ignite',
          title: 'Start a 5 minute Ignite session',
          description: 'Use the focus timer to make the first step feel tiny.',
          priority: 'normal',
          completed: false,
          source: 'manual',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'demo-task-fog',
          title: 'Break one stuck task into micro-steps',
          description: 'Use Fog Cutter when the task still feels too big.',
          priority: 'normal',
          completed: false,
          source: 'manual',
          createdAt: now - 1000,
          updatedAt: now - 1000,
        },
      ]),
    );
  }

  if (captureState.items.length === 0) {
    await StorageService.set(
      StorageService.STORAGE_KEYS.captureInbox,
      buildPersistedCaptureStore([
        {
          id: 'demo-cap-note',
          source: 'text',
          status: 'unreviewed',
          raw: 'Ask whether this should become a task or stay a note.',
          createdAt: Date.now(),
        },
      ]),
    );
  }

  await StorageService.set(StorageService.STORAGE_KEYS.streakCount, '3');
};

export const GuestSessionService = {
  async restoreSession(): Promise<GuestSessionRecord | null> {
    return StorageService.getJSON<GuestSessionRecord>(
      GUEST_SESSION_STORAGE_KEY,
    );
  },

  createGuestUser(record?: Partial<GuestSessionRecord>): User {
    return {
      uid: record?.id ?? 'guest-local',
      email: null,
      displayName: record?.seedDemoData ? 'Demo Guest' : 'Guest Mode',
      isAnonymous: true,
    } as User;
  },

  async startSession({
    seedDemoData = false,
  }: {
    seedDemoData?: boolean;
  } = {}): Promise<GuestSessionRecord> {
    const record: GuestSessionRecord = {
      id: `guest-${Date.now()}`,
      seedDemoData,
      createdAt: Date.now(),
    };

    if (seedDemoData) {
      await seedGuestDemoData();
    }

    await StorageService.setJSON(GUEST_SESSION_STORAGE_KEY, record);
    return record;
  },

  async enableDemoData(): Promise<GuestSessionRecord> {
    const existing = (await StorageService.getJSON<GuestSessionRecord>(
      GUEST_SESSION_STORAGE_KEY,
    )) ?? {
      id: `guest-${Date.now()}`,
      seedDemoData: false,
      createdAt: Date.now(),
    };

    await seedGuestDemoData();

    const record: GuestSessionRecord = {
      ...existing,
      seedDemoData: true,
    };
    await StorageService.setJSON(GUEST_SESSION_STORAGE_KEY, record);
    return record;
  },

  async clearSession(): Promise<void> {
    await StorageService.remove(GUEST_SESSION_STORAGE_KEY);
  },
};

export default GuestSessionService;
