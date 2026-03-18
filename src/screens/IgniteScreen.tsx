import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { CosmicBackground, GlowCard } from '../ui/cosmic';
import { NightAweBackground } from '../ui/nightAwe';
import { getIgniteScreenStyles } from './IgniteScreen.styles';
import { IgniteTimerDisplay } from './ignite/IgniteTimerDisplay';
import { useIgniteController } from './ignite/useIgniteController';
import { BackHeader } from '../components/ui/BackHeader';

const IgniteScreen = () => {
  const { isCosmic, isNightAwe, t, variant } = useTheme();
  const styles = getIgniteScreenStyles(variant, t);
  const controller = useIgniteController();

  const rationaleContent = (
    <>
      <Text style={styles.rationaleTitle}>WHY THIS WORKS</Text>
      <Text style={styles.rationaleText}>
        Based on CBT/CADDI principles, the hardest part of ADHD is often
        starting. This 5-minute timer creates a low-commitment entry point to
        bypass procrastination and build behavioral activation momentum.
      </Text>
    </>
  );

  const content = (
    <SafeAreaView
      style={styles.container}
      accessibilityLabel="Ignite screen"
      accessibilityRole="summary"
    >
      <View style={styles.centerWrapper}>
        <View style={styles.content}>
          <BackHeader title="IGNITE_PROTOCOL" />
          <View style={styles.header}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {controller.isRunning ? 'RUNNING' : 'READY'}
              </Text>
            </View>
          </View>

          {isNightAwe ? (
            <View style={styles.rationaleCardSurface}>{rationaleContent}</View>
          ) : (
            <GlowCard
              glow="soft"
              tone="base"
              padding="md"
              style={styles.rationaleCard}
            >
              {rationaleContent}
            </GlowCard>
          )}

          <IgniteTimerDisplay
            formattedTime={controller.formattedTime}
            isCosmic={isCosmic}
            isNightAwe={isNightAwe}
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
  );

  if (isNightAwe) {
    return (
      <NightAweBackground
        variant="focus"
        activeFeature="ignite"
        motionMode="idle"
      >
        {content}
      </NightAweBackground>
    );
  }

  return <CosmicBackground variant="nebula">{content}</CosmicBackground>;
};

export default IgniteScreen;
