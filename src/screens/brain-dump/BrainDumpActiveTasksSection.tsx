import React from 'react';
import { Text, View } from 'react-native';

type ActiveTask = {
  id: string;
  title: string;
};

interface BrainDumpActiveTasksSectionProps {
  tasks: ActiveTask[];
  styles: {
    sortedSection: object;
    sortedHeader: object;
    sortedItemRow: object;
    sortedItemText: object;
  };
}

export function BrainDumpActiveTasksSection({
  tasks,
  styles,
}: BrainDumpActiveTasksSectionProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <View style={styles.sortedSection}>
      <Text style={styles.sortedHeader}>ACTIVE_TASKS</Text>
      {tasks.map((taskItem) => (
        <View key={taskItem.id} style={styles.sortedItemRow}>
          <Text style={styles.sortedItemText}>{taskItem.title}</Text>
        </View>
      ))}
    </View>
  );
}
