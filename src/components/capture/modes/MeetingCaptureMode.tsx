/**
 * MeetingCaptureMode - Meeting notes capture mode
 */

import React, { memo, useState, useCallback } from 'react';
import { View, Text, TextInput } from 'react-native';
import { RuneButton } from '../../../ui/cosmic/RuneButton';
import { C, MEETING_TEMPLATE } from '../config';
import { captureStyles as styles } from '../styles';

interface MeetingModeProps {
  onCapture: (raw: string) => void;
}

export const MeetingCaptureMode = memo(function MeetingCaptureMode({
  onCapture,
}: MeetingModeProps) {
  const [notes, setNotes] = useState(() => MEETING_TEMPLATE(new Date()));

  const handleConfirm = useCallback(() => {
    const trimmed = notes.trim();
    if (!trimmed) {
      return;
    }
    onCapture(trimmed);
    setNotes(MEETING_TEMPLATE(new Date()));
  }, [notes, onCapture]);

  return (
    <View style={styles.modeContent}>
      <Text style={[styles.meetingLabel, { color: C.mutedText }]}>
        MEETING NOTES
      </Text>
      <TextInput
        testID="capture-meeting-input"
        style={[
          styles.textInputMeeting,
          { color: C.starlight, borderColor: C.border },
        ]}
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlignVertical="top"
        accessibilityLabel="Meeting notes input"
      />
      <RuneButton
        onPress={handleConfirm}
        variant="primary"
        style={styles.marginTop12}
      >
        SAVE MEETING NOTES
      </RuneButton>
    </View>
  );
});
