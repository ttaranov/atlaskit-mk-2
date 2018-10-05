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
const isLocalRun = process.env.RUN_LOCAL_ONLY === 'true';
const watch = process.env.WATCH ? '--watch' : '';

// function to generate snapshot from production website
function getProdSnapshots() {
  return new Promise((resolve, reject) => {
    let cmd = `VISUAL_REGRESSION=true PROD=true jest -u`;
    if (process.env.WATCH === 'true') {
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
  let prodTestStatus;
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
    `Exiting tests with exit code: ${prodTestStatus.code} and signale: ${
      prodTestStatus.signal
    }`,
  );
  console.log(`Exiting tests with exit code: ${code} and signal: ${signal}`);

  if (!serverAlreadyRunning) {
    webpack.stopDevServer();
  }
  process.exit(code && prodTestStatus.code);
}

if (
  !process.env.BITBUCKET_BRANCH ||
  !process.env.BITBUCKET_BRANCH.includes('skip-vr')
) {
  main().catch(err => {
    console.error(err.toString());
    process.exit(1);
  });
} else {
  console.log('skipping vr test since the branch includes skip-vr');
}
