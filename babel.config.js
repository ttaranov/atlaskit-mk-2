//@flow

module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/syntax-dynamic-import',
  ],
  presets: ['@babel/react', '@babel/flow'],
  overrides: [
    {
      test: [
        './packages/core/navigation-next',
        './packages/core/drawer',
        './packages/core/global-navigation',
        './packages/core/select',
      ],
      plugins: [['emotion', { hoist: true }]],
    },
  ],
  env: {
    'production:cjs': {
      plugins: [
        '@babel/transform-runtime',
        ['styled-components', { minify: false }],
        'transform-dynamic-import',
      ],
      presets: [['@babel/env', { modules: 'commonjs' }]],
      ignore: [
        '**/__mocks__',
        '**/__tests__',
        '**/__fixtures__',
        'node_modules',
      ],
    },
    'production:esm': {
      plugins: [
        '@babel/transform-runtime',
        ['styled-components', { minify: false }],
      ],
      presets: [['@babel/env', { modules: false }]],
      ignore: [
        '**/__mocks__',
        '**/__tests__',
        '**/__fixtures__',
        'node_modules',
      ],
    },
    test: {
      presets: ['@babel/env'],
      // There is no @babel/ scoped transform for this plugin
      plugins: ['transform-dynamic-import'],
    },
  },
};
