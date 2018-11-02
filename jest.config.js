//@flow
/* eslint-disable no-console */
const CHANGED_PACKAGES = process.env.CHANGED_PACKAGES;
const COVERAGE_PACKAGES = process.env.COVERAGE_PACKAGES;
const INTEGRATION_TESTS = process.env.INTEGRATION_TESTS;
const VISUAL_REGRESSION = process.env.VISUAL_REGRESSION;
const PARALLELIZE_TESTS = process.env.PARALLELIZE_TESTS;
const TEST_ONLY_PATTERN = process.env.TEST_ONLY_PATTERN;
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
  // NOTE: all opttions with 'pattern' in the name are javascript regex's that will match if they match
  // anywhere in the string. Where-ever there are an array of patterns, jest simply 'or's all of them
  // i.e /\/__tests__\/_.*?|\/__tests__\/.*?\/_.*?|\/__tests__\/integration\//
  testPathIgnorePatterns: [
    // ignore files that are under a directory starting with "_" at the root of __tests__
    '/__tests__\\/_.*?',
    // ignore files under __tests__ that start with an underscore
    '/__tests__\\/.*?\\/_.*?',
    // ignore tests under __tests__/flow
    '/__tests__\\/flow/',
    // ignore tests under __tests__/integration (we override this if the INTEGRATION_TESTS flag is set)
    '/__tests__\\/integration/',
    // ignore tests under __tests__/vr (we override this if the VISUAL_REGRESSION flag is set)
    '/__tests__\\/visual-regression/',
  ],
  modulePathIgnorePatterns: ['./node_modules', '/dist/'],
  // don't transform any files under node_modules except @atlaskit/* and react-syntax-highlighter (it
  // uses dynamic imports which are not valid in node)
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
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/fileMock.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['./build/jest-config/index.js'],
  setupTestFrameworkScriptFile: `${__dirname}/jestFrameworkSetup.js`,
  testResultsProcessor: 'jest-junit',
  testEnvironmentOptions: {
    // Need this to have jsdom loading images.
    resources: 'usable',
  },
  coverageReporters: ['lcov', 'html', 'text-summary'],
  collectCoverage: false,
  collectCoverageFrom: [],
  coverageThreshold: {},
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

// Adding code coverage thresold configuration for unit test only
// This should add only the packages with code coverage threshold available
// If not it will keep the same flow without code coverage check
if (COVERAGE_PACKAGES) {
  const coveragePackages = JSON.parse(COVERAGE_PACKAGES);

  if (coveragePackages.collectCoverageFrom.length > 0) {
    config.collectCoverage = true;
    config.collectCoverageFrom = coveragePackages.collectCoverageFrom;
    config.coverageThreshold = coveragePackages.coverageThreshold;
  }
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

// The TEST_ONLY_PATTERN is added to let us restrict a set of tests that *would* have been run; to
// only the ones that match a given pattern. This is slightly different to something like `yarn jest packages/core`
// since we can take advantage of other parts of the jest config. `TEST_ONLY_PATTERN="packages/core" yarn run test:changed`
if (TEST_ONLY_PATTERN) {
  // There is a bit to unwrap here. What we are trying to achieve is a way to pass simple options like "packages/editor" and "!packages/editor"
  // to our script and have them work as expected. Since this is going into the testPathIgnore variable, we do need to negate the negation however.
  // So to run only non-editor tests you'd pass TEST_ONLY_PATTERN="!packages/editor". To turn that into an "ignore" regex, we can simply remove the "!".
  // Note: it's important to use "packages/editor" and not just "editor" since editor can (and does) appear in other tests paths.
  // Now, it's more complicated when we want to run tests that *only* match a specific part of a pattern.
  // We can't use a simple negative lookahead (?!packages/editor/) since this match *everything* that doesn't match our pattern
  // So we essentially have to check that all characters in the string *do not* follow our negated pattern (the . and *). We then also need
  // to match this on the whole string, otherwise *any* character that matches would be a match, hence the ^ and $
  let newIgnore = `(^((?!${TEST_ONLY_PATTERN}).)*$)`;
  if (TEST_ONLY_PATTERN.startsWith('!')) {
    newIgnore = TEST_ONLY_PATTERN.substr(1);
  }

  config.testPathIgnorePatterns.push(newIgnore);
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
  config.collectCoverage = false;
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
