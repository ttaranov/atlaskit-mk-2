// @flow
'use strict';

const child = require('child_process');
const browserstack = require('./utils/browserstack');
const selenium = require('./utils/selenium');
const webpack = require('./utils/webpack');

function runTests() {
  return new Promise((resolve, reject) => {
    let cmd = `INTEGRATION_TESTS=true jest`;

    let tests = child.spawn(cmd, {
      stdio: 'inherit',
      shell: true,
    });

    tests.on('error', err => reject(err));

    tests.on('close', (code, signal) => {
      resolve({ code, signal });
    });
  });
}

async function main() {
  await webpack.startDevServer();
  console.log(
    'User / Key',
    process.env.BROWSERSTACK_USER,
    process.env.BROWSERSTACK_KEY,
  );
  process.env.TEST_ENV === 'browserstack'
    ? await browserstack.startBrowserStack()
    : await selenium.startSelenium();

  let { code, signal } = await runTests();

  console.log(`Exiting tests with exit code: ${code} and signal: ${signal}`);

  webpack.stopDevServer();
  process.env.TEST_ENV === 'browserstack'
    ? browserstack.stopBrowserStack()
    : selenium.stopSelenium();
}

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
