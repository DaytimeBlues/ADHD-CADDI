import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';
import { CosmicBackground, GlowCard, RuneButton } from '../ui/cosmic';
import { useTaskStore } from '../store/useTaskStore';
import { FilterTab } from './TasksScreen.FilterTab';
import { TaskItem } from './TasksScreen.TaskItem';
import { TASK_PRIORITY_COLORS } from './TasksScreen.constants';
import { styles } from './TasksScreen.styles';

/**
 * TasksScreen
 *
 * Task manager with Cosmic UI aesthetic.
 * Focuses on soft glows, nebula colors, and rounded corners.
 */
export const TasksScreen = memo(function TasksScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Store
  const tasks = useTaskStore((state) => state.tasks);
  const addTaskStore = useTaskStore((state) => state.addTask);
  const toggleTaskStore = useTaskStore((state) => state.toggleTask);
  const deleteTaskStore = useTaskStore((state) => state.deleteTask);

  // Local UI State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((t) => !t.completed);
      case 'completed':
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Actions
  const handleToggle = useCallback(
    (taskId: string) => {
      toggleTaskStore(taskId);
    },
    [toggleTaskStore],
  );

  const handleAdd = useCallback(() => {
    if (!newTaskTitle.trim()) {
      return;
    }
    addTaskStore({
      title: newTaskTitle.trim(),
      priority: 'normal',
      source: 'manual',
    });
    setNewTaskTitle('');
  }, [newTaskTitle, addTaskStore]);

  const handleDelete = useCallback(
    (taskId: string) => {
      deleteTaskStore(taskId);
    },
    [deleteTaskStore],
  );

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    // Placeholder for actual sync logic in Phase 5
    setTimeout(() => setIsSyncing(false), 1500);
  }, []);

  // Stats
  const stats = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      urgent: tasks.filter((t) => t.priority === 'urgent' && !t.completed)
        .length,
    }),
    [tasks],
  );

  return (
    <CosmicBackground variant="ridge">
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            accessibilityHint="Navigates to the previous screen"
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>TASKS</Text>
            <Text style={styles.headerSubtitle}>NEBULA QUEUE</Text>
          </View>
        </View>

        <RuneButton
          variant="secondary"
          size="sm"
          onPress={handleSync}
          loading={isSyncing}
          style={styles.syncButton}
        >
          {isSyncing ? 'SYNCING' : 'SYNC'}
        </RuneButton>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Dashboard */}
        <Animated.View entering={FadeIn.delay(100).duration(300)}>
          <View style={styles.statsRow}>
            <GlowCard
              tone="raised"
              glow="soft"
              padding="sm"
              style={styles.statCard}
            >
              <Text
                style={[
                  styles.statValue,
                  { color: TASK_PRIORITY_COLORS.urgent },
                ]}
              >
                {stats.urgent}
              </Text>
              <Text style={styles.statLabel}>URGENT</Text>
            </GlowCard>

            <GlowCard
              tone="raised"
              glow="none"
              padding="sm"
              style={styles.statCard}
            >
              <Text
                style={[
                  styles.statValue,
                  { color: TASK_PRIORITY_COLORS.normal },
                ]}
              >
                {stats.total - stats.completed}
              </Text>
              <Text style={styles.statLabel}>ACTIVE</Text>
            </GlowCard>

            <GlowCard
              tone="raised"
              glow="none"
              padding="sm"
              style={styles.statCard}
            >
              <Text style={[styles.statValue, { color: '#EEF2FF' }]}>
                {stats.completed}
              </Text>
              <Text style={styles.statLabel}>DONE</Text>
            </GlowCard>
          </View>
        </Animated.View>

        {/* Add Task */}
        <Animated.View entering={FadeIn.delay(200).duration(300)}>
          <GlowCard tone="sunken" padding="none" style={styles.addTaskCard}>
            <View style={styles.addTaskContent}>
              <TextInput
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholder="New objective..."
                placeholderTextColor="rgba(238, 242, 255, 0.4)"
                onSubmitEditing={handleAdd}
                returnKeyType="done"
                style={styles.addTaskInput}
              />
              <RuneButton
                variant="primary"
                size="sm"
                onPress={handleAdd}
                disabled={!newTaskTitle.trim()}
                style={styles.addTaskButton}
              >
                +
              </RuneButton>
            </View>
          </GlowCard>
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View entering={FadeIn.delay(300).duration(300)}>
          <View style={styles.filterTabs}>
            <FilterTab
              label="ALL"
              active={filter === 'all'}
              onPress={() => setFilter('all')}
            />
            <FilterTab
              label="ACTIVE"
              active={filter === 'active'}
              onPress={() => setFilter('active')}
            />
            <FilterTab
              label="DONE"
              active={filter === 'completed'}
              onPress={() => setFilter('completed')}
            />
          </View>
        </Animated.View>

        {/* Task List */}
        <Animated.View layout={Layout.springify()}>
          {filteredTasks.map((task, index) => (
            <Animated.View
              key={task.id}
              entering={SlideInRight.delay(index * 50).duration(300)}
            >
              <TaskItem
                task={task}
                onToggle={() => handleToggle(task.id)}
                onDelete={() => handleDelete(task.id)}
              />
            </Animated.View>
          ))}

          {filteredTasks.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✨</Text>
              <Text style={styles.emptyText}>Celestial Clear</Text>
              <Text style={styles.emptySubtext}>
                The nebula is waiting for its next mission
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </CosmicBackground>
  );
});

export default TasksScreen;
