const child = require('child_process');
const writeJsonFile = require('write-json-file');
const browserstack = require('./utils/browserstack');
const selenium = require('./utils/selenium');
const webpack = require('./utils/webpack');
const jestPackageJson = require('../../jest.config');

async function writeFileToJson() {
  const { testRegex, ...newConfig } = jestPackageJson;
  newConfig['rootDir'] = '../../';
  newConfig['testMatch'] = [
    '<rootDir>/packages/**/**/tests/integration/*.(js|jsx)',
  ];
  newConfig['globals']['__baseUrl__'] = 'http://localhost:9000';
  writeJsonFile('./build/webdriver-runner/testConfig.json', newConfig).then(
    () => {
      console.log('Build config');
    },
  );
}

async function setupAndTest() {
  await writeFileToJson();
  await webpack.startDevServer().catch(err => {
    process.exit(err);
  });
  process.env.TEST_ENV === 'browserstack'
    ? await browserstack.startBrowserStack()
    : await selenium.startSelenium();
  runTests();
}

async function setupAndTestAll() {
  await writeFileToJson();
  await webpack
    .startDevServer()
    .catch(err => {
      process.exit(err);
    })
    .then(async () => {
      process.env.TEST_ENV === 'browserstack'
        ? await browserstack.startBrowserStack()
        : await selenium.startSelenium();
      runTests();
    });
}

function runTests() {
  let cmd = 'jest -c ./build/webdriver-runner/testConfig.json';
  tests = child.spawn(cmd, {
    stdio: 'inherit',
    shell: true,
  });

  tests.on('data', function(data) {
    console.log(data.toString());
  });

  tests.on('error', function(error) {
    console.log(error.toString());
  });

  tests.on('close', function(code, signal) {
    console.log(`Exiting tests with exit code: ${code} and signal: ${signal}`);

    webpack.stopDevServer();
    process.env.TEST_ENV === 'browserstack'
      ? browserstack.stopBrowserStack()
      : selenium.stopSelenium();
  });
}

setupAndTestAll();

module.exports = {};
