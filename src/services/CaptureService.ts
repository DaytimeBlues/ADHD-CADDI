/**
 * CaptureService (Zustand Facade)
 *
 * This service has been refactored to act as a middleware over `useCaptureStore`.
 * It maintains the legacy async API signature temporarily to avoid breaking changes,
 * but delegates actual state management and reactivity to Zustand.
 */

import { useCaptureStore } from '../store/useCaptureStore';
import { generateId } from '../utils/helpers';
import type {
  CaptureItem,
  CaptureSource,
  CaptureStatus,
  NewCaptureInput,
} from '../types/capture';

export type { CaptureSource, CaptureStatus, CaptureItem, NewCaptureInput };

type UnreviewedCountSubscriber = (count: number) => void;

class CaptureServiceClass {
  async getAll(filter?: { status?: CaptureStatus }): Promise<CaptureItem[]> {
    const state = useCaptureStore.getState();
    if (!state._hasHydrated) {
      // Ideally would wait for hydration, but this is a synchronous shim for now
      // Zustand persist usually hydrates before initial render finishes anyway
    }

    if (filter?.status !== undefined) {
      return state.getItemsByStatus(filter.status);
    }
    return state.items;
  }

  getUnreviewedCount(): number {
    return useCaptureStore.getState().getUnreviewedCount();
  }

  /**
   * Save a single item to the capture inbox
   */
  save(input: NewCaptureInput): CaptureItem {
    const item: CaptureItem = {
      ...input,
      id: `cap_${generateId()}`,
      createdAt: Date.now(),
      status: 'unreviewed',
    };
    useCaptureStore.getState().addItem(item);
    return item;
  }

  /**
   * Update an existing item
   */
  update(id: string, patch: Partial<CaptureItem>): void {
    useCaptureStore.getState().updateItem(id, patch);
  }

  promote(id: string, to: 'task' | 'note'): void {
    useCaptureStore.getState().updateItem(id, {
      status: 'promoted',
      promotedTo: to,
      promotedAt: Date.now(),
    });
  }

  discard(id: string): void {
    useCaptureStore.getState().updateItem(id, { status: 'discarded' });
  }

  /**
   * Remove an item from the inbox
   */
  delete(id: string): void {
    useCaptureStore.getState().deleteItem(id);
  }

  clearDiscarded(): void {
    useCaptureStore.getState().clearDiscarded();
  }

  subscribe(callback: UnreviewedCountSubscriber): () => void {
    const unsub = useCaptureStore.subscribe((state) => {
      callback(state.getUnreviewedCount());
    });
    // Immediately invoke
    callback(useCaptureStore.getState().getUnreviewedCount());
    return unsub;
  }
}

const CaptureService = new CaptureServiceClass();
export default CaptureService;
