/**
 * HomeActivationCard Component
 *
 * Displays weekly activation metrics with trend data and re-entry prompt.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { GlowCard } from '../../ui/cosmic';
import { ReEntryPrompt } from '../../components/ui/ReEntryPrompt';
import type { ActivationSummary } from '../../services/ActivationService';
import type { ReentryPromptLevel } from '../../services/RetentionService';
import type { TrendMetrics } from './useHomeMetrics';

interface HomeActivationCardProps {
  activationSummary: ActivationSummary;
  trendMetrics: TrendMetrics | null;
  reentryPromptLevel: ReentryPromptLevel;
  showReentryPrompt: boolean;
  styles: {
    activationCard: object;
    activationHeader: object;
    activationTitle: object;
    activationRate: object;
    activationGrid: object;
    statBox: object;
    statLabel: object;
    statValue: object;
    textSuccess: object;
    textError: object;
    textNeutral: object;
  };
  onPrimaryAction: () => void;
}

export function HomeActivationCard({
  activationSummary,
  trendMetrics,
  reentryPromptLevel,
  showReentryPrompt,
  styles,
  onPrimaryAction,
}: HomeActivationCardProps) {
  return (
    <GlowCard
      glow="medium"
      tone="raised"
      padding="md"
      style={styles.activationCard}
    >
      <View style={styles.activationHeader}>
        <Text style={styles.activationTitle}>WEEKLY_METRICS</Text>
        <Text style={styles.activationRate}>
          {Math.round(activationSummary.completionRate * 100)}%
        </Text>
      </View>
      <View style={styles.activationGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>STARTED</Text>
          <Text style={styles.statValue}>{activationSummary.started}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>COMPLETED</Text>
          <Text style={styles.statValue}>{activationSummary.completed}</Text>
        </View>
        {trendMetrics && (
          <>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TODAY</Text>
              <Text style={styles.statValue}>{trendMetrics.todayCount}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DELTA</Text>
              <Text
                style={[
                  styles.statValue,
                  trendMetrics.isPositive
                    ? styles.textSuccess
                    : trendMetrics.isNeutral
                      ? styles.textNeutral
                      : styles.textError,
                ]}
              >
                {trendMetrics.deltaStr}
              </Text>
            </View>
          </>
        )}
      </View>

      {showReentryPrompt && reentryPromptLevel !== 'none' && (
        <ReEntryPrompt
          level={reentryPromptLevel}
          onPrimaryAction={onPrimaryAction}
          testID="reentry-prompt"
        />
      )}
    </GlowCard>
  );
}
