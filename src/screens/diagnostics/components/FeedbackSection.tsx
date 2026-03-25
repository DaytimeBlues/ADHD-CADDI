import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Tokens } from '../../../theme/tokens';

const FEEDBACK_EMAIL = 'daytimeblues+adhdcaddi@gmail.com';

export const FeedbackSection = () => {
  const mailtoUrl =
    `mailto:${FEEDBACK_EMAIL}?subject=` +
    encodeURIComponent('ADHD-CADDI feedback');

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>TESTER FEEDBACK</Text>
      <Text style={styles.bodyText}>
        Found an issue while friend testing? Use the button below or email{' '}
        {FEEDBACK_EMAIL} with the screen name, what you expected, and what
        happened instead.
      </Text>
      <Pressable
        onPress={() => {
          Linking.openURL(mailtoUrl).catch(() => undefined);
        }}
        accessibilityRole="button"
        accessibilityLabel="Email feedback"
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>EMAIL FEEDBACK</Text>
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
  bodyText: {
    fontFamily: Tokens.type.fontFamily.sans,
    fontSize: 13,
    color: Tokens.colors.text.secondary,
    marginBottom: Tokens.spacing[3],
    lineHeight: 20,
  },
  button: {
    alignSelf: 'flex-start',
    minHeight: Tokens.layout.minTapTarget,
    paddingHorizontal: Tokens.spacing[3],
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Tokens.colors.neutral.border,
    borderRadius: 8,
    backgroundColor: Tokens.colors.neutral.dark,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    fontFamily: Tokens.type.fontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    color: Tokens.colors.indigo.primary,
    letterSpacing: 1,
  },
});
