import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearButton } from '../../components/ui/LinearButton';
import { Tokens } from '../../theme/tokens';
import { ChronoDigits, HaloRing, RuneButton } from '../../ui/cosmic';
import { getIgniteScreenStyles } from '../IgniteScreen.styles';
import { IGNITE_DURATION_SECONDS } from './useIgniteController';
import { useTheme } from '../../theme/useTheme';

interface Props {
  formattedTime: string;
  isCosmic: boolean;
  isNightAwe: boolean;
  isPlaying: boolean;
  isRestoring: boolean;
  isRunning: boolean;
  timeLeft: number;
  onPause: () => void;
  onReset: () => void;
  onStart: () => void;
  onToggleSound: () => void;
}

export const IgniteTimerDisplay = ({
  formattedTime,
  isCosmic,
  isNightAwe,
  isPlaying,
  isRestoring,
  isRunning,
  timeLeft,
  onPause,
  onReset,
  onStart,
  onToggleSound,
}: Props) => {
  const { t, variant } = useTheme();
  const styles = getIgniteScreenStyles(variant, t);

  if (isRestoring) {
    return (
      <View style={styles.timerCard}>
        <ActivityIndicator
          size="small"
          color={
            isNightAwe
              ? t.colors.semantic.secondary
              : isCosmic
                ? '#8B5CF6'
                : Tokens.colors.brand[500]
          }
        />
        <Text style={styles.restoringText}>RESTORING...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.timerSection}>
        {isNightAwe ? (
          <View
            style={[
              styles.nightAweTimerFrame,
              isRunning && styles.nightAweTimerFrameActive,
            ]}
          >
            <View style={styles.nightAweTimerInner}>
              <Text style={styles.nightAweTimerDigits}>{formattedTime}</Text>
              <Text style={styles.nightAweTimerCaption}>
                {isRunning ? 'FOCUS IN MOTION' : 'QUIETLY READY'}
              </Text>
            </View>
          </View>
        ) : isCosmic ? (
          <>
            <HaloRing
              mode="progress"
              progress={1 - timeLeft / IGNITE_DURATION_SECONDS}
              size={280}
              glow={isRunning ? 'strong' : 'medium'}
            />
            <View style={styles.timerOverlay}>
              <ChronoDigits
                value={formattedTime}
                size="hero"
                glow={isRunning ? 'strong' : 'none'}
              />
            </View>
          </>
        ) : (
          <View style={styles.timerContainer}>
            <Text style={styles.timer} adjustsFontSizeToFit numberOfLines={1}>
              {formattedTime}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        {!isRunning ? (
          isNightAwe ? (
            <Pressable
              style={({ pressed }) => [
                styles.nightAwePrimaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onStart}
            >
              <Text style={styles.nightAwePrimaryButtonText}>
                INITIATE_FOCUS
              </Text>
            </Pressable>
          ) : isCosmic ? (
            <RuneButton
              variant="primary"
              size="lg"
              glow="medium"
              onPress={onStart}
              style={styles.mainButton}
            >
              INITIATE_FOCUS
            </RuneButton>
          ) : (
            <LinearButton
              title="INITIATE_FOCUS"
              onPress={onStart}
              size="lg"
              style={styles.mainButton}
            />
          )
        ) : isNightAwe ? (
          <Pressable
            style={({ pressed }) => [
              styles.nightAweSecondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onPause}
          >
            <Text style={styles.nightAweSecondaryButtonText}>PAUSE</Text>
          </Pressable>
        ) : isCosmic ? (
          <RuneButton
            variant="secondary"
            size="lg"
            onPress={onPause}
            style={styles.mainButton}
          >
            PAUSE
          </RuneButton>
        ) : (
          <LinearButton
            title="PAUSE"
            variant="secondary"
            onPress={onPause}
            size="lg"
            style={styles.mainButton}
          />
        )}

        <View style={styles.secondaryControls}>
          <Pressable
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onReset}
          >
            <Text style={styles.resetButtonText}>RESET</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.soundButton,
              isPlaying && styles.soundButtonActive,
              pressed && styles.buttonPressed,
            ]}
            onPress={onToggleSound}
          >
            <Text
              style={[styles.soundButtonText, isPlaying && styles.textActive]}
            >
              {isPlaying ? 'BROWN NOISE: ON' : 'BROWN NOISE: OFF'}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};
