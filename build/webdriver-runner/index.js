// @flow
'use strict';

const child = require('child_process');
const browserstack = require('./utils/browserstack');
const selenium = require('./utils/selenium');
const webpack = require('./utils/webpack');
const isReachable = require('is-reachable');
const jest = require('jest');

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
  process.env.TEST_ENV === 'browserstack' ? '--maxWorkers=4' : '--maxWorkers=1';
const watch = process.env.WATCH ? '--watch' : '';

async function run() {
  process.env.INTEGRATION_TESTS = true;
  return new Promise(resolve => {
    jest.runCLI(
      {
        maxWorkers: process.env.TEST_ENV === 'browserstack' ? 4 : 1,
        watch: process.env.WATCH,
        _: process.argv.slice(2),
      },
      [process.cwd()],
      resolve,
    );
  });
}

function rerunFailedTests(result) {
  return new Promise((resolve, reject) => {
    const failingTestPaths = result.testResults
      .filter(testResult => testResult.numFailingTests > 0)
      .map(testResult => testResult.testFilePath);

    console.log(`Re-running\n${failingTestPaths.join('\n')}`);

    jest.runCLI(
      {
        testMatch: failingTestPaths,
        maxWorkers: process.env.TEST_ENV === 'browserstack' ? 4 : 1,
      },
      [process.cwd()],
      result => {
        if (result.numFailedTests > 0) {
          reject(result);
          return;
        }

        resolve(result);
      },
    );
  });
}

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
  if (!serverAlreadyRunning) {
    await webpack.startDevServer();
  }
  process.env.TEST_ENV === 'browserstack'
    ? await browserstack.startBrowserStack()
    : await selenium.startSelenium();

  let code = 0;
  try {
    const results = await run();
    if (results.numFailedTestSuites > 0) {
      console.log(`Re-running ${results.numFailedTestSuites} test suites.`);
      await rerunFailedTests(results);
    }
  } catch (e) {
    code = 1;
  }

  console.log(`Exiting tests with exit code: ${code}`);
  if (!serverAlreadyRunning) {
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
