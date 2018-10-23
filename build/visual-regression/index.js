// @flow

const child = require('child_process');
const isReachable = require('is-reachable');
const webpack = require('../../build/webdriver-runner/utils/webpack');
const fs = require('fs-extra');
const glob = require('glob');

/*
* function main() to
* start and stop webpack-dev-server,
* and run and wait for visual-regression tests complete
*/
const JEST_WAIT_FOR_INPUT_TIMEOUT = 1000;
const isLocalRun = process.env.RUN_LOCAL_ONLY === 'true';
const watch = process.env.WATCH ? '--watch' : '';

// move logic to remove all production snapshots before test starts
function removeSnapshotDir() {
  const filteredList = glob
    .sync('**/packages/**/__image_snapshots__/', {
      ignore: '**/node_modules/**',
    })
    .map(dir => {
      fs.removeSync(dir);
    });
}

// function to generate snapshot from production website
function getProdSnapshots() {
  return new Promise((resolve, reject) => {
    let cmd = `VISUAL_REGRESSION=true PROD=true jest -u`;
    if (watch) {
      cmd = `${cmd} --watch`;
    }
    runCommand(cmd, resolve, reject);
  });
}

// function to run tests and compare snapshot against prod snapshot
function runTests() {
  return new Promise((resolve, reject) => {
    const cmd = `VISUAL_REGRESSION=true jest`;
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
  let prodTestStatus /*: {code: number, signal: any}*/ = {
    code: 0,
    signal: '',
  };
  removeSnapshotDir();

  if (!serverAlreadyRunning) {
    // Overriding the env variable to start the correct packages
    process.env.VISUAL_REGRESSION = 'true';
    await webpack.startDevServer();
  }

  if (!isLocalRun) {
    prodTestStatus = await getProdSnapshots();
  }
  const { code, signal } = await runTests();

  console.log(
    `Exiting tests with exit code: ${prodTestStatus.code} and signal: ${
      prodTestStatus.signal
    }`,
  );
  console.log(`Exiting tests with exit code: ${code} and signal: ${signal}`);

  if (!serverAlreadyRunning) {
    webpack.stopDevServer();
  }

  if (prodTestStatus.code !== 0) process.exit(prodTestStatus.code);
  process.exit(code);
}

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
