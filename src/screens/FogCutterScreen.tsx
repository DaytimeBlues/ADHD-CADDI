import React, { useCallback, useMemo, useRef } from 'react';
import { SafeAreaView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ActivationService from '../services/ActivationService';
import { ROUTES } from '../navigation/routes';
import { useTheme } from '../theme/useTheme';
import { CosmicBackground } from '../ui/cosmic';
import { NightAweBackground } from '../ui/nightAwe';
import { useFogCutter } from '../hooks/useFogCutter';
import { useFogCutterAI } from '../hooks/useFogCutterAI';
import { getFogCutterScreenStyles } from './FogCutterScreen.styles';
import { FogCutterTaskComposer } from './fog-cutter/FogCutterTaskComposer';
import { FogCutterTaskList } from './fog-cutter/FogCutterTaskList';
import { BackHeader } from '../components/ui/BackHeader';
import { pushWebPathForRoute } from '../navigation/webPathMap';
import { FeatureGuideButton } from '../components/tutorial/FeatureGuideButton';
import { FeatureTutorialOverlay } from '../components/tutorial/FeatureTutorialOverlay';
import { fogCutterOnboardingFlow } from '../store/useTutorialStore';
import { useFeatureTutorial } from '../hooks/useFeatureTutorial';

type FogCutterNavigation = {
  navigate: (route: string) => void;
};

interface FogCutterScreenProps {
  navigation?: FogCutterNavigation;
}

const FogCutterScreen = ({ navigation }: FogCutterScreenProps) => {
  const stackNavigation = useNavigation<FogCutterNavigation>();
  const { isCosmic, isNightAwe, t, variant } = useTheme();
  const styles = useMemo(
    () => getFogCutterScreenStyles(variant, t),
    [t, variant],
  );
  const taskInputRef = useRef<TextInput>(null);

  const handleTaskSaved = useCallback(
    async (taskId: string) => {
      await ActivationService.requestPendingStart({
        source: 'fogcutter_handoff',
        requestedAt: new Date().toISOString(),
        context: {
          taskId,
          reason: 'user_completed_fog_cutter_decomposition',
        },
      });

      (navigation ?? stackNavigation).navigate(ROUTES.FOCUS);
    },
    [navigation, stackNavigation],
  );

  const {
    task,
    microSteps,
    newStep,
    tasks,
    focusedInput,
    isLoading,
    showGuide,
    latestSavedTaskId,
    setTask,
    setMicroSteps,
    setNewStep,
    setFocusedInput,
    addMicroStep,
    addTask,
    toggleTask,
    dismissGuide,
  } = useFogCutter(handleTaskSaved);

  const { isAiLoading, handleAiBreakdown } = useFogCutterAI({
    onStepsGenerated: useCallback(
      (steps: string[]) => {
        setMicroSteps(steps);
      },
      [setMicroSteps],
    ),
  });

  const {
    currentTutorialStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTutorial,
    guideButtonLabel,
    isReplayTutorial,
    startTutorial,
  } = useFeatureTutorial(fogCutterOnboardingFlow);

  const handleDismissGuide = useCallback(async () => {
    await dismissGuide();

    await ActivationService.requestPendingStart({
      source: 'fogcutter_handoff',
      requestedAt: new Date().toISOString(),
      context: {
        taskId: latestSavedTaskId ?? undefined,
        reason: 'user_completed_fog_cutter_decomposition',
      },
    });

    (navigation ?? stackNavigation).navigate(ROUTES.FOCUS);
  }, [dismissGuide, latestSavedTaskId, navigation, stackNavigation]);

  const content = (
    <SafeAreaView
      style={styles.container}
      accessibilityLabel="Fog cutter screen"
      accessibilityRole="summary"
    >
      <View style={styles.scrollContent}>
        <View style={styles.content}>
          <BackHeader
            title="FOG_CUTTER"
            fallbackRoute="Home"
            onBack={() => {
              pushWebPathForRoute(ROUTES.HOME);
              (navigation ?? stackNavigation).navigate(ROUTES.HOME);
            }}
          />
          <View style={styles.header}>
            <Text style={styles.title}>DECOMPOSITION</Text>
            <View style={styles.headerLine} />
            <FeatureGuideButton
              onPress={() => startTutorial()}
              accessibilityLabel="Open tutorial for fog cutter"
              testID="fogcutter-tour-button"
              label={guideButtonLabel}
              isSecondary={isReplayTutorial}
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

          <FogCutterTaskComposer
            focusedInput={focusedInput}
            isAiLoading={isAiLoading}
            isCosmic={isCosmic}
            isNightAwe={isNightAwe}
            microSteps={microSteps}
            newStep={newStep}
            onAddMicroStep={addMicroStep}
            onAddTask={addTask}
            onAiBreakdownPress={() => handleAiBreakdown(task)}
            onFocusInput={setFocusedInput}
            onNewStepChange={setNewStep}
            onTaskChange={setTask}
            saveDisabled={microSteps.length === 0}
            setTaskInputRef={taskInputRef}
            task={task}
          />

          <FogCutterTaskList
            isCosmic={isCosmic}
            isLoading={isLoading}
            isNightAwe={isNightAwe}
            onDismissGuide={handleDismissGuide}
            onExamplePress={(example) => {
              setTask(example);
              taskInputRef.current?.focus();
            }}
            onFocusTaskInput={() => taskInputRef.current?.focus()}
            onToggleTask={toggleTask}
            showGuide={showGuide}
            tasks={tasks}
          />
        </View>
      </View>
    </SafeAreaView>
  );

  if (isNightAwe) {
    return (
      <NightAweBackground
        variant="focus"
        activeFeature="fogCutter"
        motionMode="transition"
      >
        {content}
      </NightAweBackground>
    );
  }

  return (
    <CosmicBackground variant="ridge" dimmer>
      {content}
    </CosmicBackground>
  );
};

export default FogCutterScreen;
