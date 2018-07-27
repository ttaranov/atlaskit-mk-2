#!/usr/bin/env node

// @flow

const minimatch = require('minimatch');

const bolt = require('bolt');
const webpack = require('webpack');
const createConfig = require('../config');
const { print, buildBanner } = require('../banner');
const utils = require('../config/utils');

async function getGlobs() {
  const workspacesGlob = '';
  const workspaces = await bolt.getWorkspaces();
  const projectRoot = (await bolt.getProject({ cwd: process.cwd() })).dir;

  const filteredWorkspaces = workspacesGlob
    ? workspaces.filter(ws =>
        minimatch(ws.dir, workspacesGlob, { matchBase: true }),
      )
    : workspaces;

  const globs = workspacesGlob
    ? utils.createWorkspacesGlob(filteredWorkspaces, projectRoot)
    : utils.createDefaultGlob();

  return globs;
}

async function runBuild() {
  const [entry] = process.argv.slice(2);
  const env = 'production';
  const websiteEnv = process.env.WEBSITE_ENV || 'local';
  const includePatterns = true;
  const noMinimize = !!process.argv.find(arg =>
    arg.startsWith('--no-minimize'),
  );
  const report = !!process.argv.find(arg => arg.startsWith('--report'));

  let globs = await getGlobs();

  print(buildBanner());

  //
  // Creating webpack instance
  //

  const config = createConfig({
    entry,
    env,
    websiteEnv,
    includePatterns,
    globs,
    noMinimize,
    report,
  });
  const compiler = webpack(config);

  //
  // Running Webpack Compiler
  //

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) console.error(err.details);
        reject(1); // eslint-disable-line
      }

      const statsString = stats.toString({ colors: true });
      if (statsString) console.log(statsString + '\n');
      if (stats.hasErrors()) reject(2);

      resolve();
    });
  });
}

runBuild().catch(err => process.exit(err));
