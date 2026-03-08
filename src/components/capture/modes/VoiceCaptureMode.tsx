/**
 * VoiceCaptureMode - Voice recording capture mode
 */

import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import RecordingService from '../../../services/RecordingService';
import { RuneButton } from '../../../ui/cosmic/RuneButton';
import type { BubbleState } from '../captureTypes';
import { C } from '../config';
import { captureStyles as styles } from '../styles';

interface VoiceModeProps {
  onCapture: (raw: string, transcript?: string) => void;
  onStateChange: (state: BubbleState) => void;
}

export const VoiceCaptureMode = memo(function VoiceCaptureMode({
  onCapture,
  onStateChange,
}: VoiceModeProps) {
  const [phase, setPhase] = useState<
    'idle' | 'recording' | 'processing' | 'done' | 'error'
  >('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    setElapsedMs(0);
    timerRef.current = setInterval(() => {
      setElapsedMs((prev) => prev + 100);
    }, 100);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleStartRecording = useCallback(async () => {
    setErrorMsg('');
    const granted = await RecordingService.requestPermissions();
    if (!granted) {
      setPhase('error');
      setErrorMsg('Microphone permission denied. Tap to grant access.');
      return;
    }
    const started = await RecordingService.startRecording();
    if (!started) {
      setPhase('error');
      setErrorMsg('Could not start recording. Please try again.');
      return;
    }
    setPhase('recording');
    onStateChange('recording');
    startTimer();
  }, [onStateChange, startTimer]);

  const handleStopRecording = useCallback(async () => {
    stopTimer();
    setPhase('processing');
    onStateChange('processing');
    const result = await RecordingService.stopRecording();
    if (!result) {
      setPhase('error');
      setErrorMsg('Recording failed. Please try again.');
      onStateChange('idle');
      return;
    }
    // In v1, use uri as raw - transcription is async/future
    // For now, create a placeholder transcript
    const rawText = `[Voice note - ${Math.round(result.duration / 1000)}s recording]`;
    setTranscript(rawText);
    setPhase('done');
    onStateChange('idle');
  }, [stopTimer, onStateChange]);

  const handleConfirm = useCallback(() => {
    onCapture(transcript, transcript);
  }, [onCapture, transcript]);

  const handleDiscard = useCallback(() => {
    setPhase('idle');
    setTranscript('');
    setErrorMsg('');
    onStateChange('idle');
  }, [onStateChange]);

  const elapsed = `${Math.floor(elapsedMs / 60000)}:${String(Math.floor((elapsedMs % 60000) / 1000)).padStart(2, '0')}`;

  return (
    <View style={styles.modeContent}>
      {phase === 'idle' && (
        <RuneButton
          variant="primary"
          onPress={handleStartRecording}
          leftIcon={<Text style={styles.recordBtnIcon}>REC</Text>}
          style={styles.recordBtn}
        >
          TAP TO RECORD
        </RuneButton>
      )}

      {phase === 'recording' && (
        <View style={styles.recordingActive}>
          <View
            style={[styles.recordingIndicator, { backgroundColor: C.teal }]}
          />
          <Text style={[styles.recordingTime, { color: C.teal }]}>
            {elapsed}
          </Text>
          <Text style={[styles.recordingHint, { color: C.mutedText }]}>
            Recording...
          </Text>
          <RuneButton
            variant="secondary"
            size="md"
            onPress={handleStopRecording}
            style={[styles.stopBtn, { borderColor: C.teal }]}
          >
            STOP
          </RuneButton>
        </View>
      )}

      {phase === 'processing' && (
        <View style={styles.processingState}>
          <ActivityIndicator size="large" color={C.violet} />
          <Text style={[styles.processingText, { color: C.mutedText }]}>
            Processing...
          </Text>
        </View>
      )}

      {phase === 'done' && (
        <View style={styles.transcriptContainer}>
          <Text style={[styles.transcriptLabel, { color: C.mutedText }]}>
            CAPTURED
          </Text>
          <Text style={[styles.transcriptText, { color: C.starlight }]}>
            {transcript}
          </Text>
          <View style={styles.confirmRow}>
            <RuneButton
              variant="primary"
              onPress={handleConfirm}
              style={styles.confirmBtn}
            >
              SAVE TO INBOX
            </RuneButton>
            <RuneButton
              variant="danger"
              onPress={handleDiscard}
              style={styles.discardBtn}
            >
              DISCARD
            </RuneButton>
          </View>
        </View>
      )}

      {phase === 'error' && (
        <View style={styles.errorState}>
          <Text style={[styles.errorText, { color: C.rose }]}>{errorMsg}</Text>
          <Pressable
            style={[styles.retryBtn, { borderColor: C.violet }]}
            onPress={() => {
              setPhase('idle');
              setErrorMsg('');
            }}
            accessibilityLabel="Try again"
            accessibilityRole="button"
          >
            <Text style={[styles.retryBtnText, { color: C.violet }]}>
              TRY AGAIN
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
});
