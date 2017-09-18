module.exports = {
  rules: {
    'import/extensions': 'off',
    'import/no-dynamic-require': 'off',
    'no-restricted-properties': [
      'off',
      {
        object: 'React',
        property: 'Component'
      },
    ],
    'react/no-did-mount-set-state': 'off',
  },
};
