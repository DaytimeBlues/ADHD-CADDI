import { useSyncExternalStore } from 'react';
import type { LayoutRectangle } from 'react-native';

export type TutorialTargetLayout = Pick<
  LayoutRectangle,
  'x' | 'y' | 'width' | 'height'
>;

const targetLayouts = new Map<string, TutorialTargetLayout>();
let snapshot = new Map<string, TutorialTargetLayout>();
const listeners = new Set<() => void>();

const emitChange = () => {
  snapshot = new Map(targetLayouts);
  listeners.forEach((listener) => listener());
};

export const registerTutorialTarget = (
  targetId: string,
  layout: TutorialTargetLayout,
) => {
  targetLayouts.set(targetId, layout);
  emitChange();
};

export const unregisterTutorialTarget = (targetId: string) => {
  if (targetLayouts.delete(targetId)) {
    emitChange();
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => snapshot;

export const useTutorialTargetRegistry = () => {
  const targets = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    targets,
    getTargetLayout: (targetId: string) => targets.get(targetId) ?? null,
  };
};
