// metro.config.js
// NativeWind v4 requires wrapping the metro config with withNativeWind
// so it can process global.css through the Tailwind CSS pipeline.
const path = require('path');

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('cjs');
config.resolver.sourceExts.push('ts', 'tsx');
config.resolver.alias = {
  '@': path.join(__dirname, '/'),
};

config.resolver.unstable_enablePackageExports = true;
config.resolver.extraNodeModules = {
  'nanoid/non-secure': path.resolve(__dirname, 'node_modules/nanoid/non-secure/index.cjs'),
};

module.exports = withNativeWind(config, {
  // Point to the global CSS entry that contains @tailwind directives
  input: './global.css',
});