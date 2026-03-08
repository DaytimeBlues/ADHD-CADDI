import React, { memo } from 'react';
import { RuneButton } from '../ui/cosmic';
import { getTasksScreenStyles } from './TasksScreen.styles';

interface FilterTabProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export const FilterTab = memo(function FilterTab({
  label,
  active,
  onPress,
}: FilterTabProps) {
  const styles = getTasksScreenStyles();

  return (
    <RuneButton
      variant={active ? 'primary' : 'ghost'}
      size="sm"
      onPress={onPress}
      style={styles.filterTab}
    >
      {label}
    </RuneButton>
  );
});
