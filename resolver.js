// @flow

const path = require('path');
const defaultResolver = require('jest-resolve/build/defaultResolver');

module.exports = function resolver(modulePath /*: string */, params /*: any */) {
  // Skip relative modulePath
  if (!modulePath.startsWith('.') && !modulePath.startsWith(path.sep)) {
    try {
      return require.resolve(modulePath);
    } catch (e) {} // eslint-disable-line
  }

  return defaultResolver(modulePath, params);
};
