import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CosmicTokens, Tokens } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

interface ExampleTaskChipProps {
  label: string;
  onPress: () => void;
  isCosmic: boolean;
}

const ExampleTaskChip: React.FC<ExampleTaskChipProps> = ({
  label,
  onPress,
  isCosmic,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        isCosmic ? styles.chipCosmic : styles.chipLinear,
        pressed && styles.chipPressed,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          isCosmic ? styles.chipTextCosmic : styles.chipTextLinear,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

interface EmptyStateExamplesProps {
  onExamplePress: (example: string) => void;
}

const EXAMPLE_TASKS = [
  'Clean my room',
  'Write an email',
  'Study for exam',
  'Plan dinner',
  'Fix the bug',
];

const COSMIC_CHIP_BACKGROUND = `${CosmicTokens.colors.brand[500]}33`;
const COSMIC_CHIP_BORDER = `${CosmicTokens.colors.brand[500]}66`;

export const EmptyStateExamples: React.FC<EmptyStateExamplesProps> = ({
  onExamplePress,
}) => {
  const { isCosmic } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          isCosmic ? styles.titleCosmic : styles.titleLinear,
        ]}
      >
        TRY AN EXAMPLE
      </Text>
      <View style={styles.chipContainer}>
        {EXAMPLE_TASKS.map((task) => (
          <ExampleTaskChip
            key={task}
            label={task}
            onPress={() => onExamplePress(task)}
            isCosmic={isCosmic}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Tokens.spacing[4],
    alignItems: 'center',
  },
  title: {
    fontFamily: Tokens.type.fontFamily.mono,
    fontSize: Tokens.type.xs,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Tokens.spacing[3],
    textTransform: 'uppercase',
  },
  titleCosmic: {
    color: CosmicTokens.colors.brand[500],
  },
  titleLinear: {
    color: Tokens.colors.brand[500],
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Tokens.spacing[2],
  },
  chip: {
    paddingHorizontal: Tokens.spacing[3],
    paddingVertical: Tokens.spacing[2],
    borderRadius: 16,
    borderWidth: 1,
  },
  chipCosmic: {
    backgroundColor: COSMIC_CHIP_BACKGROUND,
    borderColor: COSMIC_CHIP_BORDER,
  },
  chipLinear: {
    backgroundColor: Tokens.colors.neutral.darker,
    borderColor: Tokens.colors.neutral.border,
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    fontFamily: Tokens.type.fontFamily.mono,
    fontSize: Tokens.type.sm,
  },
  chipTextCosmic: {
    color: CosmicTokens.colors.cosmic?.mist,
  },
  chipTextLinear: {
    color: Tokens.colors.text.secondary,
  },
});

export default EmptyStateExamples;
