import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../services/StorageService';
import {
  ThemeVariant,
  DEFAULT_THEME_VARIANT,
  migrateThemeVariant,
} from '../theme/themeVariant';

interface ThemeStoreState {
  variant: ThemeVariant;
  setVariant: (variant: ThemeVariant) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const normalizeThemeStoreState = (
  persistedState: Partial<ThemeStoreState> | undefined,
): Partial<ThemeStoreState> => {
  if (!persistedState) {
    return {};
  }

  return {
    ...persistedState,
    variant: migrateThemeVariant(persistedState.variant ?? null),
  };
};

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      variant: DEFAULT_THEME_VARIANT,
      setVariant: (variant) => set({ variant }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'spark-theme-storage',
      storage: createJSONStorage(() => zustandStorage),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...normalizeThemeStoreState(
          persistedState as Partial<ThemeStoreState> | undefined,
        ),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
