/**
 * Web mock for expo-av
 * Audio recording is not supported on web, so we provide no-op implementations
 */

export const Audio = {
  requestPermissionsAsync: async () => ({ status: 'granted' }),
  setAudioModeAsync: async () => {},
  RecordingOptionsPresets: {
    HIGH_QUALITY: {},
  },
  Recording: {
    createAsync: async () => ({
      recording: {
        stopAndUnloadAsync: async () => {},
        getURI: () => null,
        getStatusAsync: async () => ({ durationMillis: 0 }),
      },
    }),
  },
};

// Video component stub
export const Video = () => null;
