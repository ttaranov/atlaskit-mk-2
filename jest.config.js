//@flow
/* eslint-disable no-console */
const CHANGED_PACKAGES = process.env.CHANGED_PACKAGES;
const INTEGRATION_TESTS = process.env.INTEGRATION_TESTS;
const VISUAL_REGRESSION = process.env.VISUAL_REGRESSION;
const PARALLELIZE_TESTS = process.env.PARALLELIZE_TESTS;
const OVERRIDE_TEST_IGNORE = process.env.OVERRIDE_TEST_IGNORE;
const PROD = process.env.PROD;
// These are set by Pipelines if you are running in a parallel steps
const STEP_IDX = Number(process.env.STEP_IDX);
const STEPS = Number(process.env.STEPS);

/**
 * USAGE for parallelizing: setting PARALLELIZE_TESTS to an array of globs or an array of test files when you
 * have the STEPS and STEP_IDX vars set will automatically distribute them evenly.
 * It is important that **ALL** parallel steps are running the same command with the same number of tests and that **ALL**
 * parallel steps are running the command (i.e you can have 3 steps running jest and one running linting) as this will throw
 * the calculations off
 *
 * Run all the tests, but in parallel
 * PARALLELIZE_TESTS="$(yarn --silent jest --listTests)" yarn jest --listTests
 *
 * Run only tests for changed packages (in parallel)
 * PARALLELIZE_TESTS="$(CHANGED_PACKAGES=$(node build/ci-scripts/get.changed.packages.since.master.js) yarn --silent jest --listTests)" yarn jest --listTests
 */

const config = {
  testMatch: [`${__dirname}/**/__tests__/**/*.(js|tsx|ts)`],
  testPathIgnorePatterns: [
    // ignore files that are under a directory starting with "_" at the root of __tests__
    '/__tests__\\/_.*?',
    // ignore files under __tests__ that start with an underscore
    '/__tests__\\/.*?\\/_.*?',
    // ignore tests under __tests__/integration (we override this if the INTEGRATION_TESTS flag is set)
    '/__tests__\\/integration/',
    // ignore tests under __tests__/vr (we override this if the VISUAL_REGRESSION flag is set)
    '/__tests__\\/visual-regression/',
  ],
  modulePathIgnorePatterns: ['./node_modules'],
  transformIgnorePatterns: [
    '\\/node_modules\\/(?!@atlaskit|react-syntax-highlighter)',
  ],
  resolver: `${__dirname}/resolver.js`,
  transform: {
    '^.+\\.tsx?$': 'ts-jest/preprocessor',
    '^.+\\.js$': 'babel-jest',
  },
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.jest.json',
      skipBabel: true,
    },
    __BASEURL__: 'http://localhost:9000',
  },
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/fileMock.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['./build/jest-config/index.js'],
  setupTestFrameworkScriptFile: `${__dirname}/jestFrameworkSetup.js`,
  testResultsProcessor: 'jest-junit',
};

// If the CHANGED_PACKAGES variable is set, we parse it to get an array of changed packages and only
// run the tests for those packages
if (CHANGED_PACKAGES) {
  const changedPackages = JSON.parse(CHANGED_PACKAGES);
  const changedPackagesTestGlobs = changedPackages.map(
    pkgPath => `${__dirname}/${pkgPath}/**/__tests__/**/*.(js|tsx|ts)`,
  );
  config.testMatch = changedPackagesTestGlobs;
}

// If the INTEGRATION_TESTS / VISUAL_REGRESSION flag is set we need to
if (INTEGRATION_TESTS || VISUAL_REGRESSION) {
  const testPattern = process.env.VISUAL_REGRESSION
    ? 'visual-regression'
    : 'integration';
  const testPathIgnorePatterns /*: string[] */ = config.testPathIgnorePatterns.filter(
    pattern => pattern !== `/__tests__\\/${testPattern}/`,
  );
  config.testPathIgnorePatterns = testPathIgnorePatterns;
  // If the CHANGED_PACKAGES variable is set, only integration tests from changed packages will run
  if (CHANGED_PACKAGES) {
    const changedPackages = JSON.parse(CHANGED_PACKAGES);
    const changedPackagesTestGlobs = changedPackages.map(
      pkgPath =>
        `${__dirname}/${pkgPath}/**/__tests__/${testPattern}/**/*.(js|tsx|ts)`,
    );
    config.testMatch = changedPackagesTestGlobs;
  } else {
    config.testMatch = [`**/__tests__/${testPattern}/**/*.(js|tsx|ts)`];
  }
}

if (OVERRIDE_TEST_IGNORE) {
  config.testPathIgnorePatterns.push(
    `/${OVERRIDE_TEST_IGNORE}.+\\/__tests__\\/`,
  );
}

/**
 * Batching.
 * In CI we want to be able to split out tests into multiple parallel steps that can be run concurrently.
 * We do this by passing in a list of test files (PARALLELIZE_TESTS), the number of a parallel steps (STEPS)
 * and the (0 indexed) index of the current step (STEP_IDX). Using these we can split the test up evenly
 */
if (PARALLELIZE_TESTS) {
  const allTests = JSON.parse(PARALLELIZE_TESTS);
  config.testMatch = allTests.filter((_, i) => i % STEPS - STEP_IDX === 0);

  console.log('Parallelising jest tests.');
  console.log(`Parallel step ${String(STEP_IDX)} of ${String(STEPS)}`);
  console.log('Total test files', allTests.length);
  console.log('Number of test files in this step', config.testMatch.length);
}

// Annoyingly, if the array is empty, jest will fallback to its defaults and run everything
if (config.testMatch.length === 0) {
  config.testMatch = ['DONT-RUN-ANYTHING'];
  // only log this message if we are running in an actual terminal (output not being piped to a file
  // or a subshell)
  if (process.stdout.isTTY) {
    console.log('No packages were changed, so no tests should be run.');
  }
}

if (PROD) {
  config.globals.__BASEURL__ = 'https://atlaskit.atlassian.com';
}

module.exports = config;
