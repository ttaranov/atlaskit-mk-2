module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-typescript',
    '@babel/preset-flow',
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties'],
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
  ],
  ignore: ['**/*.d.ts', '**/__tests__/*'],

  env: {
    cjs: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        '@babel/preset-flow',
        '@babel/preset-react',
      ],
      plugins: [
        ['@babel/plugin-proposal-class-properties'],
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
      ],
      ignore: ['**/*.d.ts', '**/__tests__/*'],
    },
  },
};
