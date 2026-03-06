import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import ActivationService from '../services/ActivationService';
import { getTaskProgressSummary } from '../utils/fogCutter';
import { LinearButton } from '../components/ui/LinearButton';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressBar } from '../components/ui/ProgressBar';
import { AnimatedMicroStep } from '../components/ui/AnimatedMicroStep';
import { Shimmer } from '../components/ui/Shimmer';
import { EmptyStateExamples } from '../components/ui/EmptyStateExamples';
import { Tokens } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { ROUTES } from '../navigation/routes';
import { CosmicBackground, GlowCard, RuneButton } from '../ui/cosmic';
import { useFogCutter, Task } from '../hooks/useFogCutter';
import { useFogCutterAI } from '../hooks/useFogCutterAI';
import { getFogCutterScreenStyles } from './FogCutterScreen.styles';

type FogCutterNavigation = {
  navigate: (route: string) => void;
};

interface FogCutterScreenProps {
  navigation?: FogCutterNavigation;
}

const FogCutterScreen = ({ navigation }: FogCutterScreenProps) => {
  const { isCosmic } = useTheme();
  const styles = getFogCutterScreenStyles(isCosmic);
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

      navigation?.navigate(ROUTES.FOCUS);
    },
    [navigation],
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

    navigation?.navigate(ROUTES.FOCUS);
  }, [dismissGuide, latestSavedTaskId, navigation]);

  const handleAiBreakdownPress = useCallback(() => {
    handleAiBreakdown(task);
  }, [handleAiBreakdown, task]);

  const renderMicroStep = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <AnimatedMicroStep
      item={item}
      index={index}
      testID={`microstep-number-${index + 1}`}
    />
  );

  const renderTask = ({ item }: { item: Task }) => (
    <Pressable
      style={({
        pressed,
        hovered,
      }: {
        pressed: boolean;
        hovered?: boolean;
      }) => [
        styles.taskCard,
        item.completed && styles.taskCardCompleted,
        hovered && !item.completed && styles.taskCardHovered,
        pressed && !item.completed && styles.taskCardPressed,
      ]}
      onPress={() => toggleTask(item.id)}
    >
      <View style={styles.taskHeader}>
        <Text style={[styles.taskText, item.completed && styles.completed]}>
          {item.text}
        </Text>
        {item.completed ? (
          <Text style={styles.doneBadge}>CMPLTD</Text>
        ) : (
          <Text style={styles.stepCountText}>
            {getTaskProgressSummary(item.microSteps)}
          </Text>
        )}
      </View>

      {!item.completed && (
        <View style={styles.progressContainer}>
          <ProgressBar
            current={item.microSteps.filter((s) => s.status === 'done').length}
            total={item.microSteps.length}
            size="sm"
            color="brand"
            style={styles.progressBar}
          />
          <View style={styles.activeStepContainer}>
            <Text style={styles.activeStepLabel}>
              {item.microSteps.find((s) => s.status === 'in_progress')
                ? 'CURRENT_STEP >>'
                : 'NEXT_STEP >>'}
            </Text>
            <Text style={styles.activeStepText} numberOfLines={1}>
              {
                (
                  item.microSteps.find((s) => s.status === 'in_progress') ||
                  item.microSteps.find((s) => s.status === 'next') || {
                    text: '...',
                  }
                ).text
              }
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );

  return (
    <CosmicBackground variant="ridge" dimmer>
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>FOG_CUTTER</Text>
              <View style={styles.headerLine} />
            </View>

            <GlowCard
              glow="soft"
              tone="base"
              padding="md"
              style={styles.rationaleCard}
            >
              <Text style={styles.rationaleTitle}>WHY THIS WORKS</Text>
              <Text style={styles.rationaleText}>
                CBT/CADDI research shows ADHD paralysis comes from seeing tasks
                as monolithic. Breaking tasks into micro-steps (2-5 minutes
                each) reduces cognitive load and creates multiple completion
                wins that build dopamine and momentum.
              </Text>
            </GlowCard>

            <GlowCard
              glow="medium"
              tone="raised"
              padding="md"
              style={styles.creationCard}
            >
              <View style={styles.creationHeader}>
                <Text style={styles.cardTitle}>DECOMPOSE_TASK</Text>
              </View>
              <View style={styles.inputGroup}>
                <TextInput
                  ref={taskInputRef}
                  style={[
                    styles.input,
                    focusedInput === 'main' && styles.inputFocused,
                    styles.marginBottom8,
                  ]}
                  placeholder="> INPUT_OVERWHELMING_TASK"
                  placeholderTextColor={Tokens.colors.text.placeholder}
                  value={task}
                  onChangeText={setTask}
                  onFocus={() => setFocusedInput('main')}
                  onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.aiButtonContainer}>
                  <RuneButton
                    variant="secondary"
                    size="sm"
                    onPress={handleAiBreakdownPress}
                    disabled={!task.trim() || isAiLoading}
                    loading={isAiLoading}
                  >
                    {isAiLoading ? 'ANALYSING...' : 'AI_BREAKDOWN'}
                  </RuneButton>
                </View>
              </View>

              <View style={styles.addStepRow}>
                <TextInput
                  style={[
                    styles.stepInput,
                    focusedInput === 'step' && styles.inputFocused,
                  ]}
                  placeholder="> ADD_MICRO_STEP"
                  placeholderTextColor={Tokens.colors.text.placeholder}
                  value={newStep}
                  onChangeText={setNewStep}
                  onSubmitEditing={addMicroStep}
                  onFocus={() => setFocusedInput('step')}
                  onBlur={() => setFocusedInput(null)}
                />
                <LinearButton
                  title="+"
                  testID="add-micro-step-btn"
                  onPress={addMicroStep}
                  variant="secondary"
                  style={styles.addButton}
                />
              </View>

              {isAiLoading && (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewTitle}>ANALYSING...</Text>
                  <Shimmer width="100%" height={60} style={styles.shimmer} />
                </View>
              )}

              {microSteps.length > 0 && !isAiLoading && (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewTitle}>SEQUENCE:</Text>
                  <FlatList
                    data={microSteps}
                    renderItem={renderMicroStep}
                    keyExtractor={(_, index) => index.toString()}
                    scrollEnabled={false}
                  />
                </View>
              )}

              {isCosmic ? (
                <RuneButton
                  variant="primary"
                  size="lg"
                  glow="medium"
                  onPress={addTask}
                  disabled={microSteps.length === 0}
                  style={styles.saveButton}
                >
                  EXECUTE_SAVE
                </RuneButton>
              ) : (
                <LinearButton
                  title="EXECUTE_SAVE"
                  onPress={addTask}
                  disabled={microSteps.length === 0}
                  size="lg"
                  style={styles.saveButton}
                />
              )}
            </GlowCard>

            <View style={styles.divider} />

            {showGuide && (
              <View style={styles.guideBanner}>
                <View style={styles.guideContent}>
                  <Text style={styles.guideTitle}>CLARITY_ACHIEVED</Text>
                  <Text style={styles.guideText}>
                    READY. INITIATE_IGNITE_PROTOCOL.
                  </Text>
                </View>
                <Pressable
                  onPress={handleDismissGuide}
                  style={({ pressed }) => [
                    styles.guideButton,
                    pressed && styles.guideButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss guidance"
                >
                  <Text style={styles.guideButtonText}>ACK</Text>
                </Pressable>
              </View>
            )}

            <Text style={styles.sectionHeader}>ACTIVE_OPERATIONS</Text>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="small"
                  color={Tokens.colors.text.primary}
                />
                <Text style={styles.loadingText}>LOADING...</Text>
              </View>
            ) : (
              <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={renderTask}
                style={styles.taskList}
                ListEmptyComponent={
                  <View>
                    <EmptyState
                      icon="◈"
                      title="NO_ACTIVE_TASKS."
                      primaryActionLabel="CREATE FIRST TASK"
                      onPrimaryAction={() => taskInputRef.current?.focus()}
                      primaryVariant="secondary"
                      style={styles.emptyState}
                    />
                    <EmptyStateExamples
                      onExamplePress={(example) => {
                        setTask(example);
                        taskInputRef.current?.focus();
                      }}
                    />
                  </View>
                }
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </CosmicBackground>
  );
};

export default FogCutterScreen;
