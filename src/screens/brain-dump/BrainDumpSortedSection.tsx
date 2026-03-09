/**
 * BrainDumpSortedSection Component
 *
 * Displays AI-sorted items grouped by category.
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { SortedItem } from '../../services/AISortService';

interface BrainDumpSortedSectionProps {
  groupedSortedItems: Array<{ category: string; items: SortedItem[] }>;
  styles: {
    sortedSection: object;
    sortedHeader: object;
    categorySection: object;
    categoryTitle: object;
    sortedItemRow: object;
    sortedItemText: object;
    priorityBadge: object;
    priorityText: object;
  };
  getPriorityStyle: (priority: SortedItem['priority']) => object;
}

export function BrainDumpSortedSection({
  groupedSortedItems,
  styles,
  getPriorityStyle,
}: BrainDumpSortedSectionProps) {
  if (groupedSortedItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.sortedSection}>
      <Text style={styles.sortedHeader}>AI_SUGGESTIONS</Text>
      {groupedSortedItems.map(({ category, items: catItems }) => (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {catItems.map((item: SortedItem, idx: number) => (
            <View key={idx} style={styles.sortedItemRow}>
              <Text style={styles.sortedItemText}>
                {item.duration ? `[${item.duration}] ` : ''}
                {item.text}
              </Text>
              <View
                style={[styles.priorityBadge, getPriorityStyle(item.priority)]}
              >
                <Text style={styles.priorityText}>{item.priority}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
