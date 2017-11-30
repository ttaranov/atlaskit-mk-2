#!/usr/bin/env node

// @flow

const bolt = require('bolt');
const webpack = require('webpack');
const createConfig = require('../config');
const { print, buildBanner } = require('../banner');

async function runDevServer() {
  const [entry] = process.argv.slice(2);
  const env = 'production';
  const includePatterns = true;

  print(buildBanner());

  //
  // Creating webpack instance
  //

  const config = createConfig({ entry, env, includePatterns });
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

runDevServer().catch(err => process.exit(err));
