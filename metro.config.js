const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs'],
    resolveRequest: (context, moduleName, platform) => {
      // expo@55 references react-native/Libraries/Utilities/DevLoadingView
      // which was renamed to NativeDevLoadingView in RN 0.74.
      if (moduleName === 'react-native/Libraries/Utilities/DevLoadingView') {
        return context.resolveRequest(
          context,
          'react-native/Libraries/Utilities/NativeDevLoadingView',
          platform,
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
