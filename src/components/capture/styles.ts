/**
 * Shared styles for capture components
 */

import { StyleSheet } from 'react-native';
import { C } from './config';

export const captureStyles = StyleSheet.create({
  // Common spacers
  marginTop12: {
    marginTop: 12,
  },
  introCard: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(17, 26, 51, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(185, 194, 217, 0.12)',
    gap: 4,
  },
  introEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  introDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  introOutcome: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },

  // Mode tabs
  modeTabsScroll: {
    maxHeight: 64,
  },
  modeTabsContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(185, 194, 217, 0.15)',
    gap: 5,
  },
  modeTabIcon: {
    fontSize: 14,
  },
  modeTabLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // Mode panel
  modePanel: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  modeContent: {
    flex: 1,
  },

  // Voice mode
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
    borderRadius: 14,
    marginTop: 8,
  },
  recordBtnIcon: {
    fontSize: 22,
  },
  recordBtnLabel: {
    color: '#EEF2FF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  recordingActive: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  recordingIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  recordingTime: {
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  recordingHint: {
    fontSize: 12,
    letterSpacing: 1,
  },
  stopBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  stopBtnText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  processingState: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 12,
  },
  processingText: {
    fontSize: 13,
    letterSpacing: 1,
  },
  transcriptContainer: {
    gap: 10,
    paddingTop: 8,
  },
  transcriptLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  transcriptText: {
    fontSize: 15,
    lineHeight: 22,
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },

  // Shared confirm/discard
  confirmBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  confirmBtnText: {
    color: '#EEF2FF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  discardBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  discardBtnText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
  },

  // Error / retry
  errorState: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // Text input
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    backgroundColor: 'rgba(7, 7, 18, 0.4)',
  },
  textInputMeeting: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 160,
    backgroundColor: 'rgba(7, 7, 18, 0.4)',
    lineHeight: 22,
  },

  // Paste mode
  pasteHint: {
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  // Meeting mode
  meetingLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  // Photo mode
  photoPickBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 8,
  },
  photoPickIcon: {
    fontSize: 32,
  },
  photoPickLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  photoPickHint: {
    fontSize: 11,
    textAlign: 'center',
  },
  photoPreview: {
    gap: 10,
  },
  photoPreviewLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
  },

  // Check-in specific
  checkInPrompt: {
    color: C.starlight,
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 22,
  },
  checkInBtnTextActive: {
    color: '#070712',
  },
  checkInBtnTextDisabled: {
    color: '#888',
  },

  // Success banner
  successBanner: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(45, 212, 191, 0.15)',
  },

  errorBanner: {
    backgroundColor: 'rgba(251, 113, 133, 0.15)',
  },

  successText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Offline banner
  offlineBanner: {
    marginHorizontal: 20,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(246, 193, 119, 0.12)',
  },

  offlineText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },

  // Loading overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 7, 18, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    gap: 8,
  },

  loadingText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
