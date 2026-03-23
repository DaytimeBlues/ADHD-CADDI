import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
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
import { TutorialBubble } from '../components/tutorial/TutorialBubble';
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
            <Pressable
              onPress={() => startTutorial()}
              accessibilityRole="button"
              accessibilityLabel="Start pomodoro tutorial"
              testID="pomodoro-tour-button"
              style={({ pressed }) => [
                styles.tourButton,
                pressed && styles.tourButtonPressed,
              ]}
            >
              <Text style={styles.tourButtonText}>TOUR</Text>
            </Pressable>
          </View>

          {currentTutorialStep && (
            <View style={styles.tutorialOverlay} testID="tutorial-overlay">
              <TutorialBubble
                step={currentTutorialStep}
                stepIndex={currentStepIndex}
                totalSteps={totalSteps}
                isFirstStep={currentStepIndex === 0}
                isLastStep={currentStepIndex === totalSteps - 1}
                onNext={nextStep}
                onPrevious={previousStep}
                onSkip={skipTutorial}
              />
            </View>
          )}
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
    tourButton: {
      paddingHorizontal: Tokens.spacing[3],
      paddingVertical: Tokens.spacing[2],
      borderRadius: Tokens.radii.md,
      backgroundColor: 'rgba(139, 92, 246, 0.15)',
      borderWidth: 1,
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    tourButtonPressed: {
      opacity: 0.7,
    },
    tourButtonText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      fontWeight: '700',
      color: '#8B5CF6',
      letterSpacing: 1,
    },
    tutorialOverlay: {
      width: '100%',
      marginBottom: Tokens.spacing[4],
    },
  });

export default PomodoroScreen;
