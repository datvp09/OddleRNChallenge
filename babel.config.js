module.exports = {
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
  presets: [
    [
      'module:metro-react-native-babel-preset',
      {useTransformReactJSXExperimental: true},
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
  ],
};
