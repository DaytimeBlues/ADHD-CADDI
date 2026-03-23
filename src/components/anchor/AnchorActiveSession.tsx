import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Tokens } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { ChronoDigits, HaloRing, RuneButton } from '../../ui/cosmic';
import { LinearButton } from '../ui/LinearButton';
import { PatternConfig } from '../../hooks/useAnchorSession';
import { isWeb } from '../../utils/PlatformUtils';

interface AnchorActiveSessionProps {
  patternConfig: PatternConfig;
  phaseText: string;
  circleScale: number;
  count: number;
  onStop: () => void;
}

const BREATHING_CIRCLE_SIZE = 240;
const INNER_CIRCLE_SIZE = 140;

const getPhaseHint = (phaseText: string) => {
  switch (phaseText) {
    case 'BREATHE IN':
      return 'Fill the circle slowly as you inhale through your nose.';
    case 'HOLD':
      return 'Stay still and let the breath settle.';
    case 'BREATHE OUT':
      return 'Let your shoulders drop as the circle softens.';
    case 'REST':
      return 'Pause before the next breath starts.';
    default:
      return '';
  }
};

const formatPatternDetails = (patternConfig: PatternConfig) =>
  (
    [
      ['IN', patternConfig.inhale],
      ['HOLD', patternConfig.hold],
      ['OUT', patternConfig.exhale],
      ['REST', patternConfig.wait],
    ] as Array<[string, number]>
  )
    .filter(([, value]) => value > 0)
    .map(([label, value]) => `${label} ${value}`)
    .join(' • ');

export const AnchorActiveSession: React.FC<AnchorActiveSessionProps> = ({
  patternConfig,
  phaseText,
  circleScale,
  count,
  onStop,
}) => {
  const { isCosmic } = useTheme();
  const styles = getStyles(isCosmic);

  return (
    <View style={styles.activeContainer}>
      <View style={styles.activeHeader}>
        <Text style={styles.patternName}>{patternConfig.name}</Text>
        <Text style={styles.patternMeta}>
          {formatPatternDetails(patternConfig)}
        </Text>
      </View>

      <View style={styles.breathingCircle}>
        {isCosmic ? (
          <HaloRing
            mode="breath"
            size={BREATHING_CIRCLE_SIZE}
            strokeWidth={6}
            glow="medium"
            testID="anchor-breathing-ring"
          />
        ) : (
          <View
            style={[styles.circle, { transform: [{ scale: circleScale }] }]}
          />
        )}
        <View
          style={[
            styles.centerOrb,
            { transform: [{ scale: circleScale }] },
            phaseText === 'BREATHE OUT' || phaseText === 'REST'
              ? styles.centerOrbCalm
              : styles.centerOrbActive,
          ]}
        />
        <View style={styles.breathingOverlay}>
          <Text style={styles.phaseText}>{phaseText}</Text>
          {isCosmic ? (
            <ChronoDigits
              value={count.toString().padStart(2, '0')}
              size="hero"
              glow="medium"
              testID="anchor-count"
            />
          ) : (
            <Text testID="anchor-count" style={styles.countText}>
              {count}
            </Text>
          )}
          <Text style={styles.phaseHint}>{getPhaseHint(phaseText)}</Text>
        </View>
      </View>

      {isCosmic ? (
        <RuneButton
          onPress={onStop}
          variant="danger"
          size="lg"
          testID="anchor-stop-button"
        >
          Stop Session
        </RuneButton>
      ) : (
        <LinearButton
          title="Stop Session"
          onPress={onStop}
          variant="error"
          size="lg"
          style={styles.stopButton}
        />
      )}
    </View>
  );
};

const getStyles = (isCosmic: boolean) =>
  StyleSheet.create({
    activeContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      flex: 1,
      paddingVertical: Tokens.spacing[8],
    },
    activeHeader: {
      alignItems: 'center',
      width: '100%',
    },
    patternName: {
      fontFamily: Tokens.type.fontFamily.sans,
      color: isCosmic ? '#8B5CF6' : Tokens.colors.brand[400],
      fontSize: Tokens.type['2xl'],
      fontWeight: '600',
      letterSpacing: 1,
    },
    patternMeta: {
      marginTop: Tokens.spacing[2],
      fontFamily: Tokens.type.fontFamily.mono,
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.secondary,
      fontSize: Tokens.type.xs,
      letterSpacing: 1,
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    breathingCircle: {
      width: BREATHING_CIRCLE_SIZE,
      height: BREATHING_CIRCLE_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginVertical: Tokens.spacing[8],
    },
    centerOrb: {
      width: INNER_CIRCLE_SIZE,
      height: INNER_CIRCLE_SIZE,
      borderRadius: Tokens.radii.full,
      position: 'absolute',
      opacity: 0.24,
      ...Platform.select({
        web: isWeb
          ? { transition: 'transform 0.8s ease, background-color 0.8s ease' }
          : undefined,
      }),
    },
    centerOrbActive: {
      backgroundColor: isCosmic
        ? 'rgba(139, 92, 246, 0.7)'
        : Tokens.colors.brand[600],
    },
    centerOrbCalm: {
      backgroundColor: isCosmic
        ? 'rgba(45, 212, 191, 0.55)'
        : Tokens.colors.success.main,
    },
    breathingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circle: {
      width: INNER_CIRCLE_SIZE,
      height: INNER_CIRCLE_SIZE,
      borderRadius: Tokens.radii.full,
      backgroundColor: Tokens.colors.brand[600],
      position: 'absolute',
      opacity: 0.3,
      ...Platform.select({
        web: isWeb ? { transition: 'transform 1s ease-in-out' } : undefined,
      }),
    },
    phaseText: {
      fontFamily: Tokens.type.fontFamily.sans,
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
      fontSize: Tokens.type['2xl'],
      fontWeight: '700',
      zIndex: 1,
      marginBottom: Tokens.spacing[2],
      letterSpacing: 1,
      textAlign: 'center',
    },
    countText: {
      fontFamily: Tokens.type.fontFamily.mono,
      color: Tokens.colors.text.tertiary,
      fontSize: Tokens.type['5xl'],
      fontWeight: '800',
      zIndex: 1,
    },
    phaseHint: {
      marginTop: Tokens.spacing[2],
      maxWidth: 220,
      textAlign: 'center',
      fontFamily: Tokens.type.fontFamily.sans,
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.secondary,
      fontSize: Tokens.type.sm,
      lineHeight: 20,
      zIndex: 1,
    },
    stopButton: {
      minWidth: 200,
    },
  });
