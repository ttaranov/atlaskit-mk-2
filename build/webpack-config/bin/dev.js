#!/usr/bin/env node

// @flow

// Start of the hack for the issue with the webpack watcher that leads to it dying in attempt of watching files
// in node_modules folder which contains circular symbolic links

const DirectoryWatcher = require('watchpack/lib/DirectoryWatcher');
const _oldSetDirectory = DirectoryWatcher.prototype.setDirectory;
DirectoryWatcher.prototype.setDirectory = function(
  directoryPath,
  exist,
  initial,
  type,
) {
  if (!directoryPath.includes('node_modules')) {
    _oldSetDirectory.call(this, directoryPath, exist, initial, type);
  }
};

// End of the hack

const bolt = require('bolt');
const minimatch = require('minimatch');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const historyApiFallback = require('connect-history-api-fallback');
const createConfig = require('../config');
const utils = require('../config/utils');
const { print, devServerBanner, errorMsg } = require('../banner');

const HOST = 'localhost';
const PORT = +process.env.ATLASKIT_DEV_PORT || 9000;

async function runDevServer() {
  const [workspacesGlobRaw = ''] = process.argv.slice(2);
  const report = !!process.argv.find(arg => arg.startsWith('--report'));
  const workspacesGlob = workspacesGlobRaw.startsWith('--')
    ? ''
    : workspacesGlobRaw.replace(/^['"](.+)['"]$/, '$1'); // Unwrap string from quotes
  const mode = 'development';
  const websiteEnv = 'local';
  const projectRoot = (await bolt.getProject({ cwd: process.cwd() })).dir;
  const workspaces = await bolt.getWorkspaces();

  const filteredWorkspaces = workspacesGlob
    ? workspaces.filter(ws =>
        minimatch(ws.dir, workspacesGlob, { matchBase: true }),
      )
    : workspaces;

  const globs = workspacesGlob
    ? utils.createWorkspacesGlob(filteredWorkspaces, projectRoot)
    : utils.createDefaultGlob();

  if (!globs.length) {
    print(
      errorMsg({
        title: 'Nothing to run',
        msg: `Pattern "${workspacesGlob}" doesn't match anything.`,
      }),
    );

    process.exit(2);
  }

  print(
    devServerBanner({
      workspacesGlob,
      workspaces: filteredWorkspaces,
      port: PORT,
      host: HOST,
      isAll: !workspacesGlob,
    }),
  );

  //
  // Creating webpack instance
  //

  const config = createConfig({
    globs,
    mode,
    websiteEnv,
    report,
  });

  const compiler = webpack(config);

  //
  // Starting Webpack Dev Server
  //

  const server = new WebpackDevServer(compiler, {
    // Enable gzip compression of generated files.
    compress: true,

    historyApiFallback: true,

    overlay: true,
    stats: {
      colors: true,
      assets: false,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      // https://github.com/TypeStrong/ts-loader/issues/751
      warningsFilter: /export .* was not found in/,
    },
    before: function(app) {
      let seen = false;
      const fabricNotificationLogUrl = '/';
      const cloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';
      let counter = 0;

      app.get(
        '/gateway/api/notification-log/api/2/notifications/count/unseen',
        function(req, res) {
          // const count = seen && counter > 2 ? 0 : 4;
          // seen = true;
          // counter += 1;
          res.json({ count: 4 });
        },
      );
    },
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
    });
  });
}

runDevServer().catch(err => process.exit(err));
