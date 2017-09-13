module.exports = {
  extends: '@atlaskit/eslint-config-base',
  rules: {
    'import/no-extraneous-dependencies': ['off', 'vscode'],
    'import/no-unresolved': ['off', 'vscode'],
    'max-len': ['error', 140],
    'no-restricted-syntax': 'off',
    'no-use-before-define': 'off',
    'react/sort-comp': 'off',
  },
  env: {
    jest: true,
  },
};
