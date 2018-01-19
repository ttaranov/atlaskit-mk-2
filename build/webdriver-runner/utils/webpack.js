//@flow
'use strict';

// Start of the hack for the issue with the webpack watcher that leads to it dying in attempt of watching files
// in node_modules folder which contains circular symbolic links

const DirectoryWatcher = require('watchpack/lib/DirectoryWatcher');
const _oldcreateNestedWatcher = DirectoryWatcher.prototype.createNestedWatcher;
DirectoryWatcher.prototype.createNestedWatcher = function(
  dirPath /*: string */,
) {
  if (dirPath.includes('node_modules')) return;
  _oldcreateNestedWatcher.call(this, dirPath);
};

const _ = require('underscore');
const bolt = require('bolt');
const boltQuery = require('bolt-query');
const glob = require('glob');
const path = require('path');
const minimatch = require('minimatch');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const historyApiFallback = require('connect-history-api-fallback');

const createConfig = require('@atlaskit/webpack-config');
const {
  print,
  devServerBanner,
  errorMsg,
} = require('@atlaskit/webpack-config/banner');
const utils = require('@atlaskit/webpack-config/config/utils');

const HOST = 'localhost';
const PORT = 9000;
const WEBPACK_BUILD_TIMEOUT = 20000;

let server;
let config;

async function getPackagesWithWebdriverTests() /*: Promise<Array<string>> */ {
  const project /*: any */ = await boltQuery({
    cwd: path.join(__dirname, '..'),
    workspaceFiles: { webdriver: 'tests/integration/*.+(js|ts|tsx)' },
  });
  return project.workspaces
    .filter(workspace => workspace.files.webdriver.length)
    .map(workspace => workspace.pkg.name.split('/')[1]);
}
//
// Creating webpack instance
//
async function startDevServer() {
  const workspacesGlob = await getPackagesWithWebdriverTests();
  const env = 'production';
  const includePatterns = workspacesGlob ? false : true; // if glob exists we just want to show what matches it
  const projectRoot = (await bolt.getProject({ cwd: process.cwd() })).dir;
  const workspaces = await bolt.getWorkspaces();
  const filteredWorkspaces = workspacesGlob
    ? workspacesGlob.map(pkg =>
        workspaces.filter(ws => minimatch(ws.dir, pkg, { matchBase: true })),
      )
    : workspaces;

  const globs = workspacesGlob
    ? utils.createWorkspacesGlob(_.flatten(filteredWorkspaces), projectRoot)
    : utils.createDefaultGlob();
  if (!globs.length) {
    print(
      errorMsg({
        title: 'Nothing to run',
        msg: `Pattern doesn't match anything.`,
      }),
    );
    process.exit(2);
  }

  config = createConfig({
    entry: './src/index.js',
    host: HOST,
    port: PORT,
    globs,
    includePatterns,
    env,
    cwd: path.join(__dirname, '../../..', 'website'),
  });

  const compiler = webpack(config);
  compiler.plugin('invalid', () => console.log('Failure'));
  compiler.plugin('done', () => console.log('Compiled Packages!!'));

  //
  // Starting Webpack Dev Server
  //

  server = new WebpackDevServer(compiler, {
    // Enable gzip compression of generated files.
    compress: true,
    historyApiFallback: true,

    //silence webpack logs
    quiet: false,
    noInfo: false,
    overlay: false,

    //change stats to verbose to get detailed information
    stats: 'minimal',
    clientLogLevel: 'none',
  });

  return new Promise((resolve, reject) => {
    server.listen(PORT, HOST, err => {
      if (err) {
        console.log(err.stack || err);
        return reject(1);
      }
      server.use(
        historyApiFallback({
          disableDotRule: true,
          htmlAcceptHeaders: ['text/html'],
        }),
      );
      setTimeout(() => resolve(), WEBPACK_BUILD_TIMEOUT);
    });
  });
}

function stopDevServer() {
  server.close();
}

module.exports = { startDevServer, stopDevServer };
