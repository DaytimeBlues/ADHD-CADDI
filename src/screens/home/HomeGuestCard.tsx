import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { GlowCard } from '../../ui/cosmic';

interface HomeGuestCardProps {
  isDemoSession: boolean;
  styles: {
    overlayCard: object;
    overlayTextGroup: object;
    overlayTitle: object;
    overlayStatus: object;
    debugButtonRow: object;
    debugButton: object;
    debugButtonText: object;
  };
  onLoadDemoData: () => void;
  onExitGuest: () => void;
}

export function HomeGuestCard({
  isDemoSession,
  styles,
  onLoadDemoData,
  onExitGuest,
}: HomeGuestCardProps) {
  return (
    <GlowCard glow="soft" tone="raised" padding="sm" style={styles.overlayCard}>
      <View style={styles.overlayTextGroup}>
        <Text style={styles.overlayTitle}>GUEST MODE</Text>
        <Text style={styles.overlayStatus}>
          {isDemoSession ? 'DEMO READY' : 'LOCAL ONLY'}
        </Text>
      </View>
      <View style={styles.debugButtonRow}>
        {!isDemoSession ? (
          <Pressable
            onPress={onLoadDemoData}
            accessibilityRole="button"
            style={styles.debugButton}
          >
            <Text style={styles.debugButtonText}>LOAD DEMO DATA</Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={onExitGuest}
          accessibilityRole="button"
          style={styles.debugButton}
        >
          <Text style={styles.debugButtonText}>EXIT GUEST</Text>
        </Pressable>
      </View>
    </GlowCard>
  );
}

export default HomeGuestCard;
