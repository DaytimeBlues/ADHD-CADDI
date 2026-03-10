import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { GlowCard } from '../ui/cosmic';
import type { Task } from '../types/task';
import {
  TASK_PRIORITY_COLORS,
  TASK_PRIORITY_LABELS,
} from './TasksScreen.constants';
import { getTasksScreenStyles } from './TasksScreen.styles';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export const TaskItem = memo(function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  const styles = getTasksScreenStyles();
  const checkboxScale = useSharedValue(1);

  const animatedCheckboxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxScale.value }],
  }));

  const handleToggle = useCallback(() => {
    checkboxScale.value = withSequence(
      withSpring(1.2, { stiffness: 300, damping: 10 }),
      withSpring(1, { stiffness: 300, damping: 10 }),
    );
    onToggle();
  }, [checkboxScale, onToggle]);

  return (
    <GlowCard
      tone="base"
      glow={task.priority === 'urgent' && !task.completed ? 'soft' : 'none'}
      onPress={handleToggle}
      style={styles.taskCard}
    >
      <View style={styles.taskContent}>
        <TouchableOpacity
          onPress={handleToggle}
          activeOpacity={0.7}
          accessibilityLabel={
            task.completed ? 'Mark as incomplete' : 'Mark as complete'
          }
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          accessibilityHint={`Toggle completion status for ${task.title}`}
        >
          <Animated.View
            testID={`task-checkbox-${task.id}`}
            style={[
              styles.checkbox,
              styles.checkboxDefault,
              task.completed && {
                backgroundColor: TASK_PRIORITY_COLORS[task.priority],
                borderColor: TASK_PRIORITY_COLORS[task.priority],
              },
              animatedCheckboxStyle,
            ]}
          >
            {task.completed && <Text style={styles.checkmark}>✓</Text>}
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.taskInfo}>
          <Text
            style={[
              styles.taskTitle,
              task.completed && styles.taskTitleCompleted,
            ]}
          >
            {task.title}
          </Text>
          <View style={styles.taskMeta}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: `${TASK_PRIORITY_COLORS[task.priority]}15` },
              ]}
            >
              <Text
                style={[
                  styles.priorityLabel,
                  { color: TASK_PRIORITY_COLORS[task.priority] },
                ]}
              >
                {TASK_PRIORITY_LABELS[task.priority]}
              </Text>
            </View>
            {task.dueDate && (
              <Text style={styles.dueDate}>• {task.dueDate}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={onDelete}
          style={styles.deleteButton}
          accessibilityLabel="Delete task"
          accessibilityRole="button"
          accessibilityHint={`Removes ${task.title} from your task list`}
        >
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    </GlowCard>
  );
});
