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

  if (!modulePath.startsWith('.') && !modulePath.startsWith(path.sep)) {
    // When esolving absolute module names, follow Node.js rules (i.e. look for node_modules in
    // dir of the dependant, then in parent dir, then in parent dir ...)
    // We're not using the built-in node resolver here because it would prefer
    // top-level (cwd) node_modules and ignore sub-module's package directories.
    try {
      result = resolve.sync(modulePath, params);
    } catch (e) {} // eslint-disable-line
  } else {
    // When resolving relative paths, use webpack resolver configured to
    // prefer source files over dist/ artifacts.
    result = webpackResolver.resolveSync({}, params.basedir, modulePath);
  }

  if (result) {
    // Dereference symlinks to ensure we don't create a separate
    // module instance depending on how it was referenced.
    // @link https://github.com/facebook/jest/pull/4761
    result = fs.realpathSync(result);
  }

  return result;
};
