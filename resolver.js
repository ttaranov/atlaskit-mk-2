// @flow
const fs = require('fs');
const path = require('path');
const defaultResolver = require('jest-resolve/build/defaultResolver');

module.exports = function resolver(modulePath /*: string */, params /*: any */) {
  // Skip relative modulePath
  if (!modulePath.startsWith('.') && !modulePath.startsWith(path.sep)) {
    try {
      return require.resolve(modulePath);
    } catch (e) {} // eslint-disable-line
  }

  let result = defaultResolver(modulePath, params);

  if (result) {
    // Dereference symlinks to ensure we don't create a separate
    // module instance depending on how it was referenced.
    // @link https://github.com/facebook/jest/pull/4761
    result = fs.realpathSync(result);
  }

  return result;
};
