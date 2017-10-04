module.exports = {
  extends: '@atlaskit/eslint-config-base',
  rules: {
    'import/no-extraneous-dependencies': ['off', 'vscode'],
    'import/no-unresolved': ['off', 'vscode'],
    'max-len': ['error', 140],
    'no-restricted-properties': [
      'off',
      {
        object: 'React',
        property: 'Component',
      },
    ],
    'no-restricted-syntax': 'off',
    'no-restricted-properties': 'off',
    'no-use-before-define': 'off',
    'react/sort-comp': 'off',
    'react/prop-types': 'off'
  },
  env: {
    jest: true,
  },
};
