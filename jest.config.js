//@flow
/* eslint-disable no-console */
const RUN_ONLY = process.env.RUN_ONLY || 'all';
const INTEGRATION_TESTS =
  typeof process.env.INTEGRATION_TESTS === 'undefined'
    ? false
    : process.env.INTEGRATION_TESTS;

function generateTestMatchGlob(packagePath) {
  if (INTEGRATION_TESTS) {
    return `${__dirname}/${packagePath}/**/__tests__/integration/**/*.(js|tsx|ts)`;
  }
  return `${__dirname}/${packagePath}/refapp/*.(js|tsx|ts)`;
  // return `${__dirname}/${packagePath}/**/__tests__/(!(integration)/**/|)*.(js|tsx|ts)`;
}

// by default we'll run tests in all directories (local and master builds)
let testMatchArr = [generateTestMatchGlob('**')];

// If the RUN_ONLY variable is set, we parse the array and use that to generate the globs
if (RUN_ONLY !== 'all') {
  // Workaround to avoid running integration tests currently
  const packagesToRun = JSON.parse(RUN_ONLY);
  testMatchArr = packagesToRun.map(generateTestMatchGlob);
  if (testMatchArr.length === 0) {
    // annoyingly, if the array is empty, jest will fallback to its defaults and run everything
    testMatchArr = ['DONT-RUN-ANYTHING'];
    console.log('No packages were changed, so no tests should be run.');
  } else {
    console.log(
      'Changes detected in the following packages',
      packagesToRun.join(', '),
    );
  }
}

const config = {
  testMatch: testMatchArr,
  testPathIgnorePatterns: [
    // ignore files that are under a directory starting with "_" at the root of __tests__
    '/__tests__\\/_.*?',
    // ignore files under __tests__ that start with an underscore
    '/__tests__\\/.*?\\/_.*?',
  ],
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
    __baseUrl__: 'http://localhost:9000',
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

module.exports = config;
