import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePomodoroSession } from '../hooks/usePomodoroSession';
import { ROUTES } from '../navigation/routes';
import { Tokens } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { CosmicBackground } from '../ui/cosmic';
import { PomodoroControls } from './pomodoro/PomodoroControls';
import { PomodoroHeader } from './pomodoro/PomodoroHeader';
import { PomodoroTimerCard } from './pomodoro/PomodoroTimerCard';
import { BackHeader } from '../components/ui/BackHeader';
import { pushWebPathForRoute } from '../navigation/webPathMap';
import { FeatureGuideButton } from '../components/tutorial/FeatureGuideButton';
import { FeatureTutorialOverlay } from '../components/tutorial/FeatureTutorialOverlay';
import { pomodoroOnboardingFlow } from '../store/useTutorialStore';
import { useFeatureTutorial } from '../hooks/useFeatureTutorial';

const PomodoroScreen = () => {
  const { isCosmic } = useTheme();
  const styles = getStyles();
  const navigation = useNavigation();
  const {
    timeLeft,
    isRunning,
    formattedTime,
    isWorking,
    start,
    pause,
    reset,
    getTotalDuration,
  } = usePomodoroSession();
  const {
    currentTutorialStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTutorial,
    startTutorial,
  } = useFeatureTutorial(pomodoroOnboardingFlow);

  return (
    <CosmicBackground variant="nebula">
      <SafeAreaView
        style={styles.container}
        accessibilityLabel="Pomodoro screen"
        accessibilityRole="summary"
      >
        <View style={styles.content}>
          <BackHeader
            title="POMODORO"
            fallbackRoute="Home"
            onBack={() => {
              pushWebPathForRoute(ROUTES.HOME);
              navigation.navigate(ROUTES.HOME as never);
            }}
          />
          <View style={styles.headerRow}>
            <PomodoroHeader isCosmic={isCosmic} isWorking={isWorking} />
            <FeatureGuideButton
              onPress={() => startTutorial()}
              accessibilityLabel="Replay guide for pomodoro"
              testID="pomodoro-tour-button"
            />
          </View>

          <FeatureTutorialOverlay
            currentTutorialStep={currentTutorialStep}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            onNext={nextStep}
            onPrevious={previousStep}
            onSkip={skipTutorial}
            style={styles.tutorialOverlay}
          />
          <PomodoroTimerCard
            isCosmic={isCosmic}
            isWorking={isWorking}
            isRunning={isRunning}
            timeLeft={timeLeft}
            formattedTime={formattedTime}
            totalDuration={getTotalDuration()}
          />
          <PomodoroControls
            isCosmic={isCosmic}
            isRunning={isRunning}
            isWorking={isWorking}
            onStart={start}
            onPause={pause}
            onReset={reset}
          />
        </View>
      </SafeAreaView>
    </CosmicBackground>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    content: {
      flex: 1,
      padding: Tokens.spacing[6],
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: Tokens.layout.maxWidth.prose,
      alignSelf: 'center',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: Tokens.spacing[4],
    },
    tutorialOverlay: {
      width: '100%',
      marginBottom: Tokens.spacing[4],
    },
  });

export default PomodoroScreen;
