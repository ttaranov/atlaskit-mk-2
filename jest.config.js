//@flow
/* eslint-disable no-console */
const CHANGED_PACKAGES = process.env.CHANGED_PACKAGES;
const INTEGRATION_TESTS = process.env.INTEGRATION_TESTS;
const PARALLELIZE_TESTS = process.env.PARALLELIZE_TESTS;
// These are set by Pipelines if you are running in a parallel steps
const BITBUCKET_PARALLEL_STEP = process.env.BITBUCKET_PARALLEL_STEP;
const BITBUCKET_PARALLEL_STEP_COUNT = process.env.BITBUCKET_PARALLEL_STEP_COUNT;

/**
 * USAGE for parallelizing: setting PARALLELIZE_TESTS to an array of globs or an array of test files when you
 * have the BITBUCKET_PARALLEL_STEP and BITBUCKET_PARALLEL_STEP_COUNT vars set will automatically distribute them evenly.
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
  ],
  cacheDirectory: 'node_modules/.jest-cache',
  modulePathIgnorePatterns: ['./node_modules'],
  transformIgnorePatterns: ['\\/node_modules\\/(?!@atlaskit)'],
  resolver: `${__dirname}/resolver.js`,
  transform: {
    '^.+\\.tsx?$': 'ts-jest/preprocessor',
    '^.+\\.js$': 'babel-jest',
  },
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.fabric.json',
      skipBabel: true,
    },
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
  if (changedPackagesTestGlobs.length !== 0) {
    config.testMatch = changedPackagesTestGlobs;
  } else {
    // annoyingly, if the array is empty, jest will fallback to its defaults and run everything
    config.testMatch = ['DONT-RUN-ANYTHING'];
    console.log('No packages were changed, so no tests should be run.');
  }
}

/**
 * Chunking.
 * In CI we want to be able to split out tests into multiple parallel steps that can be run concurrently.
 * We do this by passing in a list of test files (PARALLELIZE_TESTS), the number of a parallel steps (BITBUCKET_PARALLEL_STEP_COUNT)
 * and the (0 indexed) index of the current step (BITBUCKET_PARALLEL_STEP). Using these we can split the test up evenly
 */
if (PARALLELIZE_TESTS) {
  const allTests = JSON.parse(PARALLELIZE_TESTS);
  const filesPerJob = Math.ceil(
    allTests.length / Number(BITBUCKET_PARALLEL_STEP_COUNT),
  );
  const startIdx = filesPerJob * Number(BITBUCKET_PARALLEL_STEP);
  const endIdx = startIdx + filesPerJob;
  config.testMatch = allTests.slice(startIdx, startIdx + filesPerJob);

  console.log('Parallelising jest tests.');
  console.log(
    `Parallel step ${BITBUCKET_PARALLEL_STEP} of ${BITBUCKET_PARALLEL_STEP_COUNT}`,
  );
  console.log('Total test files', allTests.length);
  console.log(`Running filess: ${startIdx}-${endIdx}`);
}

if (INTEGRATION_TESTS) {
  config.testPathIgnorePatterns = config.testPathIgnorePatterns.filter(
    pattern => pattern !== '/__tests__\\/integration/',
  );
}

module.exports = config;
