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
const updateSnapshot = process.env.IMAGE_SNAPSHOT ? '--u' : '';

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
function runTests() {
  return new Promise((resolve, reject) => {
    let cmd = `VISUAL_REGRESSION=true jest`;
    if (watch) {
      cmd = `${cmd} ${watch}`;
    }
    if (updateSnapshot) {
      cmd = `${cmd} ${updateSnapshot}`;
    }
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
  let serverAlreadyRunning = await isReachable('http://localhost:9000');
  if (!serverAlreadyRunning || !process.env.IMAGE_SNAPSHOT) {
  }

  if (isLocalRun && !updateSnapshot && !serverAlreadyRunning) {
    // Overriding the env variable to start the correct packages
    process.env.VISUAL_REGRESSION = 'true';
    await webpack.startDevServer();
  }

  const { code, signal } = await runTests();

  if (isLocalRun && serverAlreadyRunning) {
    webpack.stopDevServer();
  }
  process.exit(code);
}

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
