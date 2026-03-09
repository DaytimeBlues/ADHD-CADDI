/**
 * PasteCaptureMode - Clipboard paste capture mode
 */

import React, { memo, useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { LoggerService } from '../../../services/LoggerService';
import { RuneButton } from '../../../ui/cosmic/RuneButton';
import { isWeb } from '../../../utils/PlatformUtils';
import { C } from '../config';
import { captureStyles as styles } from '../styles';

interface PasteModeProps {
  onCapture: (raw: string) => void;
}

export const PasteCaptureMode = memo(function PasteCaptureMode({
  onCapture,
}: PasteModeProps) {
  const [text, setText] = useState('');
  const [isPasting, setIsPasting] = useState(false);

  const handleAutoPaste = useCallback(async () => {
    setIsPasting(true);
    try {
      if (isWeb) {
        // navigator.clipboard is a web-only API; cast for type safety
        const webNavigator = navigator as typeof navigator & {
          clipboard?: { readText: () => Promise<string> };
        };
        if (webNavigator.clipboard) {
          const pasted = await webNavigator.clipboard.readText();
          setText(pasted);
        }
      } else {
        // React Native Clipboard not available without @react-native-clipboard/clipboard
        // Fall back to manual text entry
        setText('');
      }
    } catch (err) {
      LoggerService.error({
        service: 'CaptureDrawer',
        operation: 'handleAutoPaste',
        message: 'Clipboard read error',
        error: err,
      });
    } finally {
      setIsPasting(false);
    }
  }, []);

  useEffect(() => {
    handleAutoPaste();
  }, [handleAutoPaste]);

  const handleConfirm = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    onCapture(trimmed);
    setText('');
  }, [text, onCapture]);

  return (
    <View style={styles.modeContent}>
      {isPasting ? (
        <ActivityIndicator color={C.violet} size="small" />
      ) : (
        <>
          <Text style={[styles.pasteHint, { color: C.mutedText }]}>
            {text ? 'Edit before saving:' : 'Paste or type content:'}
          </Text>
          <TextInput
            testID="capture-text-input"
            style={[
              styles.textInput,
              { color: C.starlight, borderColor: C.border },
            ]}
            value={text}
            onChangeText={setText}
            placeholder="Paste text here..."
            placeholderTextColor={C.mutedText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            accessibilityLabel="Paste capture input"
          />
          <RuneButton
            onPress={handleConfirm}
            disabled={!text.trim()}
            variant="primary"
            style={styles.marginTop12}
          >
            SAVE TO INBOX
          </RuneButton>
        </>
      )}
    </View>
  );
});
