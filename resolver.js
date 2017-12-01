// @flow
const fs = require('fs');
const path = require('path');
const resolve = require('resolve');

// This is the resolver used by webpack, which we configure similarly
// to AK website (see ./website/webpack.config.js - "resolve" field)
const webpackResolver = require('enhanced-resolve').ResolverFactory.createResolver(
  {
    fileSystem: fs,
    useSyncFileSystemCalls: true,
    mainFields: ['atlaskit:src', 'browser', 'main'],
    extensions: ['.js', '.ts', '.tsx'],
  },
);

module.exports = function resolver(
  modulePath /*: string */,
  params /*: any */,
) {
  let result /*: ?string */;

  result = webpackResolver.resolveSync({}, params.basedir, modulePath);

  if (result) {
    // Dereference symlinks to ensure we don't create a separate
    // module instance depending on how it was referenced.
    // @link https://github.com/facebook/jest/pull/4761
    result = fs.realpathSync(result);
  }

  return result;
};
