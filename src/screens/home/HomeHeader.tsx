import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AppIcon from '../../components/AppIcon';

interface HomeHeaderProps {
  streak: number;
  styles: {
    header: object;
    title: object;
    systemStatusRow: object;
    systemStatusText: object;
    statusDot: object;
    headerRight: object;
    settingsButton: object;
    settingsButtonText: { color?: string };
    streakBadge: object;
    streakText: object;
  };
  onOpenDiagnostics: () => void;
}

export function HomeHeader({
  streak,
  styles,
  onOpenDiagnostics,
}: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text
          style={styles.title}
          testID="home-title"
          accessibilityLabel="home-title"
        >
          SPARK_PRO
        </Text>
        <View style={styles.systemStatusRow}>
          <Text style={styles.systemStatusText}>SYS.ONLINE</Text>
          <View style={styles.statusDot} />
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          onPress={onOpenDiagnostics}
          style={styles.settingsButton}
          accessibilityLabel="Settings and Diagnostics"
        >
          <AppIcon
            name="cog-outline"
            size={18}
            color={styles.settingsButtonText.color || '#FFFFFF'}
          />
        </TouchableOpacity>
        <View
          style={styles.streakBadge}
          testID="home-streak-badge"
          accessibilityRole="text"
          accessibilityLabel={`Streak: ${streak} ${streak !== 1 ? 'days' : 'day'}`}
        >
          <Text
            style={styles.streakText}
            testID="home-streak"
            accessibilityLabel="home-streak"
          >
            STREAK.{streak.toString().padStart(3, '0')}
          </Text>
        </View>
      </View>
    </View>
  );
}
