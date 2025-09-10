module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      require('babel-plugin-module-resolver').default,
      {
        alias: {
          '@': './src',
        },
        loglevel: 'silent',
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
