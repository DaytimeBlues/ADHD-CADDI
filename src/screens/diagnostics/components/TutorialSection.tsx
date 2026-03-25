import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Tokens } from '../../../theme/tokens';

type TutorialSectionProps = {
  tutorialsEnabled: boolean;
  onToggleTutorials: (enabled: boolean) => void;
  onResetTutorialProgress: () => void;
};

export const TutorialSection = ({
  tutorialsEnabled,
  onToggleTutorials,
  onResetTutorialProgress,
}: TutorialSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>GUIDED HELP</Text>
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text style={styles.label}>Show guided tutorials</Text>
          <Text style={styles.description}>
            Automatically show step-by-step guides the first time you open a
            supported screen.
          </Text>
        </View>
        <Switch
          value={tutorialsEnabled}
          onValueChange={onToggleTutorials}
          testID="tutorials-enabled-toggle"
          accessibilityLabel="Show guided tutorials"
        />
      </View>
      <Pressable
        onPress={onResetTutorialProgress}
        accessibilityRole="button"
        accessibilityLabel="Reset tutorial progress"
        testID="tutorials-reset-progress"
        style={styles.resetButton}
      >
        <Text style={styles.resetButtonText}>RESET TUTORIAL PROGRESS</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: Tokens.spacing[6],
  },
  sectionTitle: {
    fontFamily: Tokens.type.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Tokens.colors.text.secondary,
    letterSpacing: 1,
    marginBottom: Tokens.spacing[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Tokens.spacing[4],
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontFamily: Tokens.type.fontFamily.mono,
    fontSize: Tokens.type.base,
    fontWeight: '700',
    color: Tokens.colors.text.primary,
    marginBottom: 4,
  },
  description: {
    fontFamily: Tokens.type.fontFamily.sans,
    fontSize: Tokens.type.sm,
    color: Tokens.colors.text.secondary,
    lineHeight: 20,
  },
  resetButton: {
    marginTop: Tokens.spacing[3],
    minHeight: Tokens.layout.minTapTarget,
    justifyContent: 'center',
  },
  resetButtonText: {
    fontFamily: Tokens.type.fontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    color: Tokens.colors.indigo.primary,
    letterSpacing: 0.8,
  },
});

export default TutorialSection;
