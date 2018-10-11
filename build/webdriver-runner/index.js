// @flow
'use strict';

const path = require('path');
const browserstack = require('./utils/browserstack');
const selenium = require('./utils/selenium');
const webpack = require('./utils/webpack');
const isReachable = require('is-reachable');
const jest = require('jest');

/*
 * function main() to
 * start and stop webpack-dev-server, selenium-standalone-server, browserstack connections
 * and run and wait for webdriver tests complete
 * 
 * maxWorkers set to 4 when using browserstack and 1 when running locally. 
 * By default the tests are running headlessly, set HEADLESS=false if you want to run them directly on real browsers.
 * if WATCH= true, by default, it will start chrome. 
 */

process.env.NODE_ENV = 'test';
process.env.INTEGRATION_TESTS = 'true';

const isBrowserStack = process.env.TEST_ENV === 'browserstack';
const maxWorkers = isBrowserStack ? 4 : 1;

function getExitCode(result) {
  return !result || result.success ? 0 : 1;
}

async function runJest(testPaths) {
  const status = await jest.runCLI(
    {
      _: testPaths || process.argv.slice(2),
      maxWorkers,
      watch: !!process.env.WATCH,
    },
    [process.cwd()],
  );
  return status.results;
}

async function rerunFailedTests(result) {
  const failingTestPaths = result.testResults
    .filter(testResult => testResult.numFailingTests > 0)
    .map(testResult => testResult.testFilePath);

  if (!failingTestPaths.length) {
    getExitCode(result);
    return;
  }

  console.log(
    `Re-running ${
      result.numFailedTestSuites
    } test suites.\n${failingTestPaths.join('\n')}`,
  );

  // We don't want to clobber the original results
  // Now we'll upload two test result files.
  process.env.JEST_JUNIT_OUTPUT = path.join(
    process.cwd(),
    'test-reports/junit-rerun.xml',
  );
  const results = await runJest(failingTestPaths);
  return results;
}

function runTestsWithRetry() {
  return new Promise(async resolve => {
    let code = 0;
    try {
      const results = await runJest();
      code = getExitCode(results);
      if (code !== 0 && isBrowserStack) {
        code = await rerunFailedTests(results);
      }
    } catch (err) {
      console.error(err.toString());
      resolve(1);
      return;
    }

    resolve(code);
  });
}

async function main() {
  const serverAlreadyRunning = await isReachable('http://localhost:9000');
  if (!serverAlreadyRunning) {
    await webpack.startDevServer();
  }

  isBrowserStack
    ? await browserstack.startBrowserStack()
    : await selenium.startSelenium();

  const code = await runTestsWithRetry();

  console.log(`Exiting tests with exit code: ${+code}`);
  if (!serverAlreadyRunning) {
    webpack.stopDevServer();
  }

  isBrowserStack ? browserstack.stopBrowserStack() : selenium.stopSelenium();
  process.exit(code);
}

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
