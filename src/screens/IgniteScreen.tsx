import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { CosmicBackground, GlowCard } from '../ui/cosmic';
import { getIgniteScreenStyles } from './IgniteScreen.styles';
import { IgniteTimerDisplay } from './ignite/IgniteTimerDisplay';
import { useIgniteController } from './ignite/useIgniteController';

const IgniteScreen = () => {
  const { isCosmic } = useTheme();
  const styles = getIgniteScreenStyles(isCosmic);
  const controller = useIgniteController();

  return (
    <CosmicBackground variant="nebula">
      <SafeAreaView
        style={styles.container}
        accessibilityLabel="Ignite screen"
        accessibilityRole="summary"
      >
        <View style={styles.centerWrapper}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>IGNITE_PROTOCOL</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {controller.isRunning ? 'RUNNING' : 'READY'}
                </Text>
              </View>
            </View>

            <GlowCard
              glow="soft"
              tone="base"
              padding="md"
              style={styles.rationaleCard}
            >
              <Text style={styles.rationaleTitle}>WHY THIS WORKS</Text>
              <Text style={styles.rationaleText}>
                Based on CBT/CADDI principles, the hardest part of ADHD is often
                starting. This 5-minute timer creates a low-commitment entry
                point to bypass procrastination and build behavioral activation
                momentum.
              </Text>
            </GlowCard>

            <IgniteTimerDisplay
              formattedTime={controller.formattedTime}
              isCosmic={isCosmic}
              isPlaying={controller.isPlaying}
              isRestoring={controller.isRestoring}
              isRunning={controller.isRunning}
              timeLeft={controller.timeLeft}
              onPause={controller.pauseTimer}
              onReset={controller.resetTimer}
              onStart={controller.startTimer}
              onToggleSound={controller.toggleSound}
            />
          </View>
        </View>
      </SafeAreaView>
    </CosmicBackground>
  );
};

export default IgniteScreen;
