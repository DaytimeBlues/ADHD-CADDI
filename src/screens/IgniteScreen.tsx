import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import SoundService from '../services/SoundService';
import StorageService from '../services/StorageService';
import UXMetricsService from '../services/UXMetricsService';
import ActivationService from '../services/ActivationService';
import { LoggerService } from '../services/LoggerService';
import useTimer from '../hooks/useTimer';
import { useTimerStore } from '../store/useTimerStore';
import { Tokens, CosmicTokens } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { LinearButton } from '../components/ui/LinearButton';
import { isWeb } from '../utils/PlatformUtils';
import {
  CosmicBackground,
  ChronoDigits,
  RuneButton,
  HaloRing,
  GlowCard,
} from '../ui/cosmic';
import { getIgniteScreenStyles } from './IgniteScreen.styles';

const IGNITE_DURATION_SECONDS = 5 * 60;

const IgniteScreen = () => {
  const { isCosmic } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const sessionIdRef = useRef<string | null>(null);

  const { timeLeft, isRunning, formattedTime, start, pause, reset, setTime } =
    useTimer({
      id: 'ignite',
      initialTime: IGNITE_DURATION_SECONDS,
      onComplete: () => {
        SoundService.playCompletionSound();
        UXMetricsService.track('ignite_timer_completed');
        const sessionId = sessionIdRef.current;
        if (sessionId) {
          ActivationService.updateSessionStatus(sessionId, 'completed').catch(
            (error) => {
              LoggerService.error({
                service: 'IgniteScreen',
                operation: 'onComplete',
                message: 'Failed to mark session completed',
                error,
                context: { sessionId },
              });
            },
          );
          sessionIdRef.current = null;
        }
      },
    });

  useEffect(() => {
    SoundService.initBrownNoise();

    const loadState = async () => {
      try {
        const pendingStart = await ActivationService.consumePendingStart();

        const storedState = await StorageService.getJSON<{
          isPlaying: boolean;
          activeSessionId?: string;
        }>(StorageService.STORAGE_KEYS.igniteState);

        if (storedState) {
          UXMetricsService.track('ignite_session_restored');

          if (storedState.isPlaying) {
            setIsPlaying(true);
            SoundService.playBrownNoise();
          }

          if (storedState.activeSessionId) {
            sessionIdRef.current = storedState.activeSessionId;

            if (!useTimerStore.getState().isRunning) {
              ActivationService.updateSessionStatus(
                storedState.activeSessionId,
                'resumed',
              ).catch((error) => {
                LoggerService.error({
                  service: 'IgniteScreen',
                  operation: 'loadState',
                  message: 'Failed to mark session resumed',
                  error,
                  context: { sessionId: storedState.activeSessionId },
                });
              });
            }
          }
        }

        // Check for last active session if no stored session ID
        if (!sessionIdRef.current) {
          const lastActive = await StorageService.getJSON<{
            id: string;
            source: string;
            startedAt: string;
            status: string;
          }>(StorageService.STORAGE_KEYS.lastActiveSession);

          if (lastActive && lastActive.status === 'started') {
            sessionIdRef.current = lastActive.id;
            ActivationService.updateSessionStatus(
              lastActive.id,
              'resumed',
            ).catch((error) => {
              LoggerService.error({
                service: 'IgniteScreen',
                operation: 'loadState',
                message: 'Failed to resume last session',
                error,
                context: { sessionId: lastActive.id },
              });
            });
          }
        }

        if (pendingStart) {
          const newSessionId = await ActivationService.startSession(
            pendingStart.source,
          );
          sessionIdRef.current = newSessionId;
          start();
          UXMetricsService.track('ignite_timer_started_from_pending_handoff');
        }
      } catch (error) {
        LoggerService.error({
          service: 'IgniteScreen',
          operation: 'loadState',
          message: 'Failed to load ignite state',
          error,
        });
      } finally {
        setIsRestoring(false);
      }
    };

    loadState();

    return () => {
      SoundService.stopBrownNoise();
      SoundService.releaseBrownNoise();
    };
  }, [setTime, start]);

  useEffect(() => {
    // Save only essential flags for ignite since time is in the global useTimerStore
    StorageService.setJSON(StorageService.STORAGE_KEYS.igniteState, {
      isPlaying,
      activeSessionId: sessionIdRef.current,
    });
  }, [isPlaying]);

  const startTimer = () => {
    if (!sessionIdRef.current) {
      ActivationService.startSession('ignite')
        .then((sessionId) => {
          sessionIdRef.current = sessionId;
        })
        .catch((error) => {
          LoggerService.error({
            service: 'IgniteScreen',
            operation: 'startTimer',
            message: 'Failed to start session',
            error,
          });
        });
    }
    start();
    UXMetricsService.track('ignite_timer_started');
  };

  const pauseTimer = () => {
    pause();
    const sessionId = sessionIdRef.current;
    if (sessionId) {
      ActivationService.updateSessionStatus(sessionId, 'abandoned').catch(
        (error) => {
          LoggerService.error({
            service: 'IgniteScreen',
            operation: 'pauseTimer',
            message: 'Failed to mark session abandoned',
            error,
            context: { sessionId },
          });
        },
      );
      sessionIdRef.current = null;
    }
  };

  const resetTimer = () => {
    reset();
    setIsPlaying(false);
    SoundService.pauseBrownNoise();
    const sessionId = sessionIdRef.current;
    if (sessionId) {
      ActivationService.updateSessionStatus(sessionId, 'abandoned').catch(
        (error) => {
          LoggerService.error({
            service: 'IgniteScreen',
            operation: 'resetTimer',
            message: 'Failed to mark session abandoned',
            error,
            context: { sessionId },
          });
        },
      );
      sessionIdRef.current = null;
    }
  };

  const toggleSound = () => {
    setIsPlaying((prev) => {
      if (prev) {
        SoundService.pauseBrownNoise();
      } else {
        SoundService.playBrownNoise();
      }

      return !prev;
    });
  };

  const styles = getIgniteScreenStyles(isCosmic);

  return (
    <CosmicBackground variant="nebula" dimmer style={StyleSheet.absoluteFill}>
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrapper}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>IGNITE_PROTOCOL</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {isRunning ? 'RUNNING' : 'READY'}
                </Text>
              </View>
            </View>

            <GlowCard
              glow="soft"
              tone="base"
              padding="md"
              style={styles.rationaleCard}
            >
              <Text style={styles.rationaleTitle}>WHY THIS WORKS</Text>
              <Text style={styles.rationaleText}>
                Based on CBT/CADDI principles, the hardest part of ADHD is often
                starting. This 5-minute timer creates a low-commitment entry
                point to bypass procrastination and build behavioral activation
                momentum.
              </Text>
            </GlowCard>

            {isRestoring ? (
              <View style={styles.timerCard}>
                <ActivityIndicator
                  size="small"
                  color={
                    isCosmic
                      ? CosmicTokens.colors.semantic.primary
                      : Tokens.colors.brand[500]
                  }
                />
                <Text style={styles.restoringText}>RESTORING...</Text>
              </View>
            ) : (
              <>
                <View style={styles.timerSection}>
                  {isCosmic ? (
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
                      <Text
                        style={styles.timer}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                      >
                        {formattedTime}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.controls}>
                  {!isRunning ? (
                    isCosmic ? (
                      <RuneButton
                        variant="primary"
                        size="lg"
                        glow="medium"
                        onPress={startTimer}
                        style={styles.mainButton}
                      >
                        INITIATE_FOCUS
                      </RuneButton>
                    ) : (
                      <LinearButton
                        title="INITIATE_FOCUS"
                        onPress={startTimer}
                        size="lg"
                        style={styles.mainButton}
                      />
                    )
                  ) : isCosmic ? (
                    <RuneButton
                      variant="secondary"
                      size="lg"
                      onPress={pauseTimer}
                      style={styles.mainButton}
                    >
                      PAUSE
                    </RuneButton>
                  ) : (
                    <LinearButton
                      title="PAUSE"
                      variant="secondary"
                      onPress={pauseTimer}
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
                      onPress={resetTimer}
                    >
                      <Text style={styles.resetButtonText}>RESET</Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.soundButton,
                        isPlaying && styles.soundButtonActive,
                        pressed && styles.buttonPressed,
                      ]}
                      onPress={toggleSound}
                    >
                      <Text
                        style={[
                          styles.soundButtonText,
                          isPlaying && styles.textActive,
                        ]}
                      >
                        {isPlaying ? 'NOISE: ON' : 'NOISE: OFF'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </CosmicBackground>
  );
};

export default IgniteScreen;
