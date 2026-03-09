import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { EmptyState } from '../../components/ui/EmptyState';
import { EmptyStateExamples } from '../../components/ui/EmptyStateExamples';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { getTaskProgressSummary } from '../../utils/fogCutter';
import { getFogCutterScreenStyles } from '../FogCutterScreen.styles';
import type { Task } from '../../hooks/useFogCutter';

interface Props {
  isCosmic: boolean;
  isLoading: boolean;
  onDismissGuide: () => void;
  onExamplePress: (example: string) => void;
  onFocusTaskInput: () => void;
  onToggleTask: (id: string) => void;
  showGuide: boolean;
  tasks: Task[];
}

export const FogCutterTaskList = ({
  isCosmic,
  isLoading,
  onDismissGuide,
  onExamplePress,
  onFocusTaskInput,
  onToggleTask,
  showGuide,
  tasks,
}: Props) => {
  const styles = getFogCutterScreenStyles(isCosmic);

  return (
    <>
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
            onPress={onDismissGuide}
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
          <ActivityIndicator size="small" color="#EEF2FF" />
          <Text style={styles.loadingText}>LOADING...</Text>
        </View>
      ) : (
        <View style={styles.taskList}>
          <View style={styles.listContent}>
            {tasks.map((item) => (
              <Pressable
                key={item.id}
                accessible={false}
                style={(state) => [
                  styles.taskCard,
                  item.completed && styles.taskCardCompleted,
                  (state as { pressed: boolean; hovered?: boolean }).hovered &&
                    !item.completed &&
                    styles.taskCardHovered,
                  state.pressed && !item.completed && styles.taskCardPressed,
                ]}
                onPress={() => onToggleTask(item.id)}
              >
                <View style={styles.taskHeader}>
                  <Text
                    style={[
                      styles.taskText,
                      item.completed && styles.completed,
                    ]}
                  >
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
                      current={
                        item.microSteps.filter((step) => step.status === 'done')
                          .length
                      }
                      total={item.microSteps.length}
                      size="sm"
                      color="brand"
                      style={styles.progressBar}
                    />
                    <View style={styles.activeStepContainer}>
                      <Text style={styles.activeStepLabel}>
                        {item.microSteps.find(
                          (step) => step.status === 'in_progress',
                        )
                          ? 'CURRENT_STEP >>'
                          : 'NEXT_STEP >>'}
                      </Text>
                      <Text style={styles.activeStepText} numberOfLines={1}>
                        {
                          (
                            item.microSteps.find(
                              (step) => step.status === 'in_progress',
                            ) ||
                            item.microSteps.find(
                              (step) => step.status === 'next',
                            ) || {
                              text: '...',
                            }
                          ).text
                        }
                      </Text>
                    </View>
                  </View>
                )}
              </Pressable>
            ))}

            {tasks.length === 0 && (
              <View>
                <EmptyState
                  icon="◈"
                  title="NO_ACTIVE_TASKS."
                  primaryActionLabel="CREATE FIRST TASK"
                  onPrimaryAction={onFocusTaskInput}
                  primaryVariant="secondary"
                  style={styles.emptyState}
                />
                <EmptyStateExamples onExamplePress={onExamplePress} />
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
};
