const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs'],
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react-native/Libraries/Utilities/DevLoadingView') {
        return {
          filePath: require.resolve(
            'react-native/Libraries/Utilities/NativeDevLoadingView',
          ),
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
