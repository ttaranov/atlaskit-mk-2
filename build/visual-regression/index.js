// @flow

const child = require('child_process');
const isReachable = require('is-reachable');
const webpack = require('../../build/webdriver-runner/utils/webpack');

/*
* function main() to
* start and stop webpack-dev-server,
* and run and wait for visual-regression tests complete
*/
const JEST_WAIT_FOR_INPUT_TIMEOUT = 1000;

// function to generate snapshot from production website
function getProdSnapshots() {
  return new Promise((resolve, reject) => {
    // --runInBand to run in headless mode since parallel thread is not supported on chromeless
    const cmd = `VISUAL_REGRESSION=true PROD=true jest -u `;
    runCommand(cmd, resolve, reject);
  });
}

// function to run tests and compare snapshot against prod snapshot
function runTests() {
  return new Promise((resolve, reject) => {
    const cmd = `VISUAL_REGRESSION=true jest `;
    runCommand(cmd, resolve, reject);
  });
}

function runCommand(cmd, resolve, reject) {
  const tests = child.spawn(cmd, process.argv.slice(2), {
    stdio: 'inherit',
    shell: true,
  });

  tests.on('error', reject);

  tests.on('close', (code, signal) => {
    setTimeout(resolve, JEST_WAIT_FOR_INPUT_TIMEOUT, { code, signal });
  });
}

async function main() {
  const serverAlreadyRunning = await isReachable('http://localhost:9000');
  if (!serverAlreadyRunning) {
    // Overriding the env variable to start the correct packages
    process.env.VISUAL_REGRESSION = 'true';
    await webpack.startDevServer();
  }

  // const prodSnapshots = await getProdSnapshots();
  const { code, signal } = await runTests();

  console.log(`Exiting tests with exit code: ${code} and signal: ${signal}`);

  if (!serverAlreadyRunning) {
    webpack.stopDevServer();
  }
  process.exit(code);
}

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
