// @flow
'use strict';

const child = require('child_process');
const browserstack = require('./utils/browserstack');
const selenium = require('./utils/selenium');
const webpack = require('./utils/webpack');
const argv = require('yargs').argv;

function runTests() {
  const pattern = argv.pattern || '';
  return new Promise((resolve, reject) => {
    let cmd = `INTEGRATION_TESTS=true jest ${pattern}`;

    let tests = child.spawn(cmd, {
      stdio: 'inherit',
      shell: true,
    });

    tests.on('error', reject);

    tests.on('close', (code, signal) => {
      resolve({ code, signal });
    });
  });
}

async function main() {
  await webpack.startDevServer();
  process.env.TEST_ENV === 'browserstack'
    ? await browserstack.startBrowserStack()
    : await selenium.startSelenium();

  let { code, signal } = await runTests();

  console.log(`Exiting tests with exit code: ${code} and signal: ${signal}`);

  webpack.stopDevServer();
  process.env.TEST_ENV === 'browserstack'
    ? browserstack.stopBrowserStack()
    : selenium.stopSelenium();
  process.exit(code);
}

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
