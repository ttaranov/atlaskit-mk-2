// @flow
'use strict';

const child = require('child_process');
const isPortAvailable = require('is-port-available');
const browserstack = require('./utils/browserstack');
const selenium = require('./utils/selenium');
const webpack = require('./utils/webpack');

const JEST_WAIT_FOR_INPUT_TIMEOUT = 1000;

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
  (async function() {
    const port = 9000;
    const status = await isPortAvailable(port);

    if (status) {
      console.log(`Port: ${port} is available - start webpack!`);
      await webpack.startDevServer();
    } else {
      console.log(`Port: ${port}  is already in use!`);
    }
  })();
  process.env.TEST_ENV === 'browserstack'
    ? await browserstack.startBrowserStack()
    : await selenium.startSelenium();

  const { code, signal } = await runTests();

  console.log(`Exiting tests with exit code: ${code} and signal: ${signal}`);

  (await isPortAvailable(9000)) ? webpack.stopDevServer() : {};
  process.env.TEST_ENV === 'browserstack'
    ? browserstack.stopBrowserStack()
    : selenium.stopSelenium();
  process.exit(code);
}

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
