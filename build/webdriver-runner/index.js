// @flow
'use strict';

const child = require('child_process');
const browserstack = require('./utils/browserstack');
const selenium = require('./utils/selenium');
const webpack = require('./utils/webpack');
const isReachable = require('is-reachable');

/*
* function main() to
* start and stop webpack-dev-server, selenium-standalone-server, browserstack connections
* and run and wait for webdriver tests complete
*/

const JEST_WAIT_FOR_INPUT_TIMEOUT = 1000;
/* 
 * maxWorkers set to 4 when using browserstack and 1 when running locally. 
 * By default the tests are running headlessly, set HEADLESS=false if you want to run them directly on real browsers.
 * if WATCH= true, by default, it will start chrome.
 *  */
const maxWorkers =
  process.env.TEST_ENV === 'browserstack' ? '--maxWorkers=5' : '--maxWorkers=1';
const watch = process.env.WATCH ? '--watch' : '';
function runTests() {
  return new Promise((resolve, reject) => {
    let cmd = `INTEGRATION_TESTS=true jest ${maxWorkers} ${watch}`;
    const tests = child.spawn(cmd, process.argv.slice(2), {
      stdio: 'inherit',
      shell: true,
    });

    tests.on('error', reject);

    // reject tests if theres a cmd + c
    tests.on('SIGINT', () => {
      console.log('received SIGINT', process.exit());
    });

    tests.on('close', (code, signal) => {
      setTimeout(resolve, JEST_WAIT_FOR_INPUT_TIMEOUT, { code, signal });
    });
  });
}

async function main() {
  const serverAlreadyRunning = await isReachable('http://localhost:9000');
  // For testing the website package, there is no need to start the webpack server
  if (
    !serverAlreadyRunning &&
    process.argv.slice(2).indexOf('website') === -1
  ) {
    await webpack.startDevServer();
  }
  process.env.TEST_ENV === 'browserstack'
    ? await browserstack.startBrowserStack()
    : await selenium.startSelenium();

  const { code, signal } = await runTests();

  console.log(`Exiting tests with exit code: ${code} and signal: ${signal}`);
  // For testing the website package, there is no need to stop the webpack server
  if (
    !serverAlreadyRunning &&
    process.argv.slice(2).indexOf('website') === -1
  ) {
    webpack.stopDevServer();
  }
  process.env.TEST_ENV === 'browserstack'
    ? browserstack.stopBrowserStack()
    : selenium.stopSelenium();
  process.exit(code);
}

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
