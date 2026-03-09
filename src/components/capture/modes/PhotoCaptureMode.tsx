/**
 * PhotoCaptureMode - Photo/image capture mode
 */

import React, { memo, useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { RuneButton } from '../../../ui/cosmic/RuneButton';
import { isWeb } from '../../../utils/PlatformUtils';
import { C } from '../config';
import { captureStyles as styles } from '../styles';

interface PhotoModeProps {
  onCapture: (raw: string, attachmentUri?: string) => void;
}

export const PhotoCaptureMode = memo(function PhotoCaptureMode({
  onCapture,
}: PhotoModeProps) {
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const handlePickFile = useCallback(() => {
    if (isWeb) {
      // document and HTMLInputElement are web-only APIs; use globalThis cast
      const doc = (
        globalThis as typeof globalThis & {
          document?: {
            createElement: (tag: 'input') => {
              type: string;
              accept: string;
              onchange:
                | ((e: {
                    target: { files?: { 0?: { name: string } } };
                  }) => void)
                | null;
              click: () => void;
            };
          };
        }
      ).document;
      if (!doc) {
        return;
      }
      const input = doc.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const files = (e.target as { files?: { 0?: unknown; length: number } })
          .files;
        const file = files?.[0];
        if (file) {
          const uri = URL.createObjectURL(file as unknown as Blob);
          setSelectedUri(uri);
        }
      };
      input.click();
    }
    // Native: would use react-native-image-picker (v2 scope)
  }, []);

  const handleConfirm = useCallback(() => {
    const raw = caption.trim() || '[Photo capture]';
    onCapture(raw, selectedUri ?? undefined);
    setSelectedUri(null);
    setCaption('');
  }, [caption, selectedUri, onCapture]);

  return (
    <View style={styles.modeContent}>
      {selectedUri ? (
        <View style={styles.photoPreview}>
          <Text style={[styles.photoPreviewLabel, { color: C.mutedText }]}>
            Photo selected
          </Text>
          <TextInput
            testID="capture-text-input"
            style={[
              styles.textInput,
              { color: C.starlight, borderColor: C.border },
            ]}
            value={caption}
            onChangeText={setCaption}
            placeholder="Add a caption (optional)..."
            placeholderTextColor={C.mutedText}
            accessibilityLabel="Photo caption input"
          />
          <RuneButton
            onPress={handleConfirm}
            variant="primary"
            style={styles.marginTop12}
          >
            SAVE TO INBOX
          </RuneButton>
        </View>
      ) : (
        <Pressable
          style={[styles.photoPickBtn, { borderColor: C.violet }]}
          onPress={handlePickFile}
          accessibilityLabel="Select a photo"
          accessibilityRole="button"
        >
          <Text style={styles.photoPickIcon}>IMG</Text>
          <Text style={[styles.photoPickLabel, { color: C.violet }]}>
            SELECT PHOTO
          </Text>
          {!isWeb && (
            <Text style={[styles.photoPickHint, { color: C.mutedText }]}>
              Camera/gallery coming in v2
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
});
