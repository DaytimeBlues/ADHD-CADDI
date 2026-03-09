/**
 * HomeOverlayCard Component
 *
 * Displays the Android overlay toggle card with status indicator.
 */

import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Tokens } from '../../theme/tokens';
import { GlowCard } from '../../ui/cosmic';

interface HomeOverlayCardProps {
  isOverlayEnabled: boolean;
  isOverlayPermissionRequesting: boolean;
  styles: {
    overlayCard: object;
    overlayCardActive?: object;
    overlayTextGroup: object;
    overlayTitle: object;
    overlayStatus: object;
    overlayStatusActive?: object;
  };
  onToggle: (value: boolean) => void;
}

export function HomeOverlayCard({
  isOverlayEnabled,
  isOverlayPermissionRequesting,
  styles,
  onToggle,
}: HomeOverlayCardProps) {
  return (
    <GlowCard
      glow={isOverlayEnabled ? 'medium' : 'soft'}
      tone={isOverlayEnabled ? 'raised' : 'base'}
      padding="sm"
      style={[styles.overlayCard, isOverlayEnabled && styles.overlayCardActive]}
    >
      <View style={styles.overlayTextGroup}>
        <Text style={styles.overlayTitle}>FOCUS_OVERLAY</Text>
        <Text
          style={[
            styles.overlayStatus,
            isOverlayEnabled && styles.overlayStatusActive,
          ]}
          accessibilityLiveRegion="polite"
        >
          {isOverlayPermissionRequesting
            ? 'REQ_PERM...'
            : isOverlayEnabled
              ? 'ACTIVE'
              : 'INACTIVE'}
        </Text>
      </View>
      <Switch
        testID="home-overlay-toggle"
        accessibilityRole="switch"
        accessibilityLabel="home-overlay-toggle"
        accessibilityState={{
          checked: isOverlayEnabled,
          busy: isOverlayPermissionRequesting,
          disabled: isOverlayPermissionRequesting,
        }}
        trackColor={{
          false: Tokens.colors.neutral[700],
          true: Tokens.colors.brand[500],
        }}
        thumbColor={Tokens.colors.neutral[0]}
        ios_backgroundColor={Tokens.colors.neutral[700]}
        onValueChange={onToggle}
        disabled={isOverlayPermissionRequesting}
        value={isOverlayEnabled}
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      />
    </GlowCard>
  );
}
