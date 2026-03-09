/**
 * CaptureDrawer
 *
 * Bottom sheet drawer with capture modes.
 * Opens via CaptureBubble FAB.
 */

import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { BottomSheet } from '../../ui/cosmic/BottomSheet';
import CaptureService, { CaptureSource } from '../../services/CaptureService';
import { LoggerService } from '../../services/LoggerService';
import type { BubbleState } from './captureTypes';
import { DrawerMode, MODES, MODE_COPY, C } from './config';
import { captureStyles as styles } from './styles';
import {
  CheckInCaptureMode,
  MeetingCaptureMode,
  PasteCaptureMode,
  PhotoCaptureMode,
  TaskCaptureMode,
  TextCaptureMode,
  VoiceCaptureMode,
} from './modes';

export interface CaptureDrawerProps {
  visible: boolean;
  onClose: () => void;
  onStateChange: (state: BubbleState) => void;
  currentBubbleState: BubbleState;
}

export const CaptureDrawer = memo(function CaptureDrawer({
  visible,
  onClose,
  onStateChange,
  currentBubbleState,
}: CaptureDrawerProps) {
  const [activeMode, setActiveMode] = useState<DrawerMode>('task');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible && currentBubbleState === 'needs-checkin') {
      setActiveMode('checkin');
    }
  }, [visible, currentBubbleState]);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const showSuccess = useCallback(
    (msg: string) => {
      setSuccessMsg(msg);
      successTimeoutRef.current = setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    },
    [onClose],
  );

  const handleCapture = useCallback(
    async (
      source: CaptureSource,
      raw: string,
      extra?: { transcript?: string; attachmentUri?: string },
    ) => {
      setIsSaving(true);
      setSaveError(null);
      try {
        await CaptureService.save({
          source,
          raw,
          transcript: extra?.transcript,
          attachmentUri: extra?.attachmentUri,
        });
        showSuccess('Saved to inbox');
      } catch (err) {
        LoggerService.error({
          service: 'CaptureDrawer',
          operation: 'saveCapture',
          message: 'Failed to save capture',
          error: err,
          context: { source },
        });
        setSaveError('Failed to save. Please try again.');
      } finally {
        setIsSaving(false);
      }
    },
    [showSuccess],
  );

  const handleVoiceCapture = useCallback(
    (raw: string, transcript?: string) =>
      handleCapture('voice', raw, { transcript }),
    [handleCapture],
  );
  const handleTextCapture = useCallback(
    (raw: string) => handleCapture('text', raw),
    [handleCapture],
  );
  const handlePasteCapture = useCallback(
    (raw: string) => handleCapture('paste', raw),
    [handleCapture],
  );
  const handleMeetingCapture = useCallback(
    (raw: string) => handleCapture('meeting', raw),
    [handleCapture],
  );
  const handleCheckInCapture = useCallback(
    (raw: string) => handleCapture('checkin', raw),
    [handleCapture],
  );
  const handlePhotoCapture = useCallback(
    (raw: string, attachmentUri?: string) =>
      handleCapture('photo', raw, { attachmentUri }),
    [handleCapture],
  );

  const currentModeCopy = MODE_COPY[activeMode];

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="CAPTURE"
      testID="capture-drawer"
      maxHeightFraction={0.85}
      scrollable={false}
    >
      <View style={styles.introCard}>
        <Text style={[styles.introEyebrow, { color: C.violet }]}>
          QUICK CAPTURE
        </Text>
        <Text style={[styles.introTitle, { color: C.starlight }]}>
          {currentModeCopy.title}
        </Text>
        <Text style={[styles.introDescription, { color: C.mutedText }]}>
          {currentModeCopy.description}
        </Text>
        <Text style={[styles.introOutcome, { color: C.starlight }]}>
          {currentModeCopy.outcome}
        </Text>
      </View>

      {successMsg !== '' && (
        <View style={styles.successBanner}>
          <Text style={[styles.successText, { color: C.teal }]}>
            {successMsg}
          </Text>
        </View>
      )}

      {saveError !== null && (
        <View style={[styles.successBanner, styles.errorBanner]}>
          <Text style={[styles.successText, { color: C.rose }]}>
            {saveError}
          </Text>
        </View>
      )}

      {isSaving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={C.violet} />
          <Text style={[styles.loadingText, { color: C.mutedText }]}>
            Saving...
          </Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.modeTabsScroll}
        contentContainerStyle={styles.modeTabsContent}
      >
        {MODES.map((mode) => (
          <Pressable
            key={mode.id}
            testID={`capture-mode-${mode.id}`}
            style={[
              styles.modeTab,
              activeMode === mode.id && {
                backgroundColor: C.activeModeTab,
                borderColor: C.violet,
              },
            ]}
            onPress={() => !isSaving && setActiveMode(mode.id)}
            accessibilityLabel={`${mode.label} capture mode`}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeMode === mode.id }}
          >
            <Text style={styles.modeTabIcon}>{mode.icon}</Text>
            <Text
              style={[
                styles.modeTabLabel,
                { color: activeMode === mode.id ? C.violet : C.mutedText },
              ]}
            >
              {mode.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.modePanel}>
        {activeMode === 'task' && (
          <TaskCaptureMode onSuccess={() => showSuccess('Task added')} />
        )}
        {activeMode === 'voice' && (
          <VoiceCaptureMode
            onCapture={handleVoiceCapture}
            onStateChange={onStateChange}
          />
        )}
        {activeMode === 'text' && (
          <TextCaptureMode onCapture={handleTextCapture} />
        )}
        {activeMode === 'paste' && (
          <PasteCaptureMode onCapture={handlePasteCapture} />
        )}
        {activeMode === 'meeting' && (
          <MeetingCaptureMode onCapture={handleMeetingCapture} />
        )}
        {activeMode === 'checkin' && (
          <CheckInCaptureMode onCapture={handleCheckInCapture} />
        )}
        {activeMode === 'photo' && (
          <PhotoCaptureMode onCapture={handlePhotoCapture} />
        )}
      </View>

      {currentBubbleState === 'offline' && (
        <View style={styles.offlineBanner}>
          <Text style={[styles.offlineText, { color: C.gold }]}>
            Offline - captures will sync when reconnected
          </Text>
        </View>
      )}
    </BottomSheet>
  );
});

export default CaptureDrawer;
