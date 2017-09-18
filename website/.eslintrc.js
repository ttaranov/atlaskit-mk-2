module.exports = {
  rules: {
    'import/no-dynamic-require': 'off',
    'no-restricted-properties': [
      'off',
      {
        object: 'React',
        property: 'Component',
        message: 'grrr',
      },
    ],
    'react/no-did-mount-set-state': 'off',
  },
};
