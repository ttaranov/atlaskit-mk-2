// @flow
'use strict';

const child = require('child_process');
const browserstack = require('./utils/browserstack');
const selenium = require('./utils/selenium');
const webpack = require('./utils/webpack');
const isReachable = require('is-reachable');
const util = require('util');

const JEST_WAIT_FOR_INPUT_TIMEOUT = 1000;
let buildServer;

function runTests() {
  return new Promise((resolve, reject) => {
    const cmd = `INTEGRATION_TESTS=true jest`;

    const tests = child.spawn(cmd, process.argv.slice(2), {
      stdio: 'inherit',
      shell: true,
    });

    tests.on('error', reject);

    tests.on('close', (code, signal) => {
      setTimeout(resolve, JEST_WAIT_FOR_INPUT_TIMEOUT, { code, signal });
    });
  });
}

async function main() {
  buildServer = await isReachable('http://localhost:9000');
  buildServer ? {} : await webpack.startDevServer();
  process.env.TEST_ENV === 'browserstack'
    ? await browserstack.startBrowserStack()
    : await selenium.startSelenium();

  const { code, signal } = await runTests();

  console.log(`Exiting tests with exit code: ${code} and signal: ${signal}`);

  buildServer ? {} : webpack.stopDevServer();
  process.env.TEST_ENV === 'browserstack'
    ? browserstack.stopBrowserStack()
    : selenium.stopSelenium();
  process.exit(code);
}

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
