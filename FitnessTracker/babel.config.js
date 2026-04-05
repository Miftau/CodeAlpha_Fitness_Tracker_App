module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // jsxImportSource tells expo's preset to use nativewind's JSX runtime
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      // nativewind/babel is a PRESET (returns { plugins:[...] }), not a plugin —
      // must be in presets[], not plugins[]
      'nativewind/babel',
    ],
    plugins: [
      // react-native-reanimated/plugin must always be last if Reanimated is used, and it is in this project
      'react-native-reanimated/plugin',
    ],
  };
};