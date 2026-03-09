import React, { RefObject } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { LinearButton } from '../../components/ui/LinearButton';
import { Shimmer } from '../../components/ui/Shimmer';
import { RuneButton, GlowCard } from '../../ui/cosmic';
import { AnimatedMicroStep } from '../../components/ui/AnimatedMicroStep';
import { getFogCutterScreenStyles } from '../FogCutterScreen.styles';

interface Props {
  focusedInput: string | null;
  isAiLoading: boolean;
  isCosmic: boolean;
  microSteps: string[];
  newStep: string;
  onAddMicroStep: () => void;
  onAddTask: () => void;
  onAiBreakdownPress: () => void;
  onFocusInput: (value: string | null) => void;
  onNewStepChange: (value: string) => void;
  onTaskChange: (value: string) => void;
  saveDisabled: boolean;
  setTaskInputRef: RefObject<TextInput>;
  task: string;
}

export const FogCutterTaskComposer = ({
  focusedInput,
  isAiLoading,
  isCosmic,
  microSteps,
  newStep,
  onAddMicroStep,
  onAddTask,
  onAiBreakdownPress,
  onFocusInput,
  onNewStepChange,
  onTaskChange,
  saveDisabled,
  setTaskInputRef,
  task,
}: Props) => {
  const styles = getFogCutterScreenStyles(isCosmic);

  return (
    <>
      <GlowCard
        glow="soft"
        tone="base"
        padding="md"
        style={styles.rationaleCard}
      >
        <Text style={styles.rationaleTitle}>WHY THIS WORKS</Text>
        <Text style={styles.rationaleText}>
          CBT/CADDI research shows ADHD paralysis comes from seeing tasks as
          monolithic. Breaking tasks into micro-steps (2-5 minutes each) reduces
          cognitive load and creates multiple completion wins that build
          dopamine and momentum.
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
            ref={setTaskInputRef}
            style={[
              styles.input,
              focusedInput === 'main' && styles.inputFocused,
              styles.marginBottom8,
            ]}
            placeholder="> INPUT_OVERWHELMING_TASK"
            placeholderTextColor="#94A3B8"
            value={task}
            onChangeText={onTaskChange}
            onFocus={() => onFocusInput('main')}
            onBlur={() => onFocusInput(null)}
          />
          <View style={styles.aiButtonContainer}>
            <RuneButton
              variant="secondary"
              size="sm"
              onPress={onAiBreakdownPress}
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
            placeholderTextColor="#94A3B8"
            value={newStep}
            onChangeText={onNewStepChange}
            onSubmitEditing={onAddMicroStep}
            onFocus={() => onFocusInput('step')}
            onBlur={() => onFocusInput(null)}
          />
          <LinearButton
            title="+"
            testID="add-micro-step-btn"
            onPress={onAddMicroStep}
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
              renderItem={({ item, index }) => (
                <AnimatedMicroStep
                  item={item}
                  index={index}
                  testID={`microstep-number-${index + 1}`}
                />
              )}
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
            onPress={onAddTask}
            disabled={saveDisabled}
            style={styles.saveButton}
          >
            EXECUTE_SAVE
          </RuneButton>
        ) : (
          <LinearButton
            title="EXECUTE_SAVE"
            onPress={onAddTask}
            disabled={saveDisabled}
            size="lg"
            style={styles.saveButton}
          />
        )}
      </GlowCard>
    </>
  );
};
