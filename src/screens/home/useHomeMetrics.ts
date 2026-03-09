/**
 * useHomeMetrics Hook
 *
 * Computes trend metrics, streak/loading behavior, and re-entry prompt selection
 * for the HomeScreen component.
 */

import { useMemo } from 'react';
import type {
  ActivationDailyTrendPoint,
  ActivationSummary,
} from '../../services/ActivationService';
import type { ReentryPromptLevel } from '../../services/RetentionService';

export interface TrendMetrics {
  todayCount: number;
  deltaStr: string;
  isPositive: boolean;
  isNeutral: boolean;
  maxStarted: number;
}

export interface UseHomeMetricsReturn {
  trendMetrics: TrendMetrics | null;
  hasActivationData: boolean;
  showReentryPrompt: boolean;
}

export function useHomeMetrics(
  activationSummary: ActivationSummary | null,
  activationTrend: ActivationDailyTrendPoint[],
  reentryPromptLevel: ReentryPromptLevel,
): UseHomeMetricsReturn {
  const trendMetrics = useMemo((): TrendMetrics | null => {
    if (activationTrend.length === 0) {
      return null;
    }
    const today = activationTrend[activationTrend.length - 1];
    const yesterday =
      activationTrend.length > 1
        ? activationTrend[activationTrend.length - 2]
        : null;
    const maxStarted = Math.max(...activationTrend.map((d) => d.started));

    const todayCount = today.started;
    const yesterdayCount = yesterday ? yesterday.started : 0;
    const delta = todayCount - yesterdayCount;
    const deltaStr = delta > 0 ? `+${delta}` : `${delta}`;
    const isPositive = delta > 0;
    const isNeutral = delta === 0;

    return {
      todayCount,
      deltaStr,
      isPositive,
      isNeutral,
      maxStarted,
    };
  }, [activationTrend]);

  const hasActivationData =
    activationSummary !== null && activationSummary.started > 0;

  const showReentryPrompt =
    reentryPromptLevel === 'gentle_restart' ||
    reentryPromptLevel === 'fresh_restart';

  return {
    trendMetrics,
    hasActivationData,
    showReentryPrompt,
  };
}
