import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { CheckInOption } from './checkInData';
import { getCheckInScreenStyles } from '../CheckInScreen.styles';

interface Props {
  isCosmic: boolean;
  title: string;
  options: CheckInOption[];
  selectedValue: number | null;
  testIdPrefix: string;
  onSelect: (value: number) => void;
}

export const CheckInOptionGroup = ({
  isCosmic,
  title,
  options,
  selectedValue,
  testIdPrefix,
  onSelect,
}: Props) => {
  const styles = getCheckInScreenStyles(isCosmic);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.options}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            testID={`${testIdPrefix}-${option.value}`}
            accessibilityRole="button"
            accessibilityLabel={`${title} ${option.label}`}
            style={(state) => [
              styles.option,
              selectedValue === option.value && styles.selected,
              (state as { pressed: boolean; hovered?: boolean }).hovered &&
                selectedValue !== option.value &&
                styles.optionHovered,
              state.pressed && styles.optionPressed,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <View style={styles.optionContent}>
              <Text
                style={[
                  styles.label,
                  selectedValue === option.value && styles.selectedLabel,
                ]}
              >
                {option.label.toUpperCase()}
              </Text>
              <Text
                style={[
                  styles.quote,
                  selectedValue === option.value && styles.selectedQuote,
                ]}
              >
                {option.quote}
              </Text>
              <Text style={styles.author}>— {option.author}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
