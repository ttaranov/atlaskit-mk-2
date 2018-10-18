const bolt = require('bolt');
const fs = require('fs');
const util = require('util');
const packages = require('../utils/packages');

const TEST_ONLY_PATTERN = process.env.TEST_ONLY_PATTERN || '';
/**
 * NOTE: This prints the coverage threshold list by changed packages since master ONLY if they have been commited.
 * It will print them all out as a json array of relative paths
 * i.e: $ node build/ci-scripts/get.code.threshold.for.changed.packages.since.master.js
 * {
 *   "coverageThreshold": {
 *     "/packages/core/global-navigation":{
 *       "statements":100,
 *       "branches":100,
 *       "functions":100,
 *       "lines":100
 *     }
 *   }
 * }
 * */
(async () => {
  const cwd = process.cwd();
  const readFile = util.promisify(fs.readFile);
  const allPackages = await bolt.getWorkspaces({ cwd });
  const changedPackages = await packages.getChangedPackagesSinceMaster();
  const testOnlyIsRemovingPattern = TEST_ONLY_PATTERN.startsWith('!');

  const changedPackagesRelativePaths = changedPackages
    .map(pkg => pkg.relativeDir)
    // Because jest.config.js relies on `TEST_ONLY_PATTERN` logic
    // We need to add a filter to check if
    // - `TEST_ONLY_PATTERN` does not exists OR
    // - `TEST_ONLY_PATTERN` is used ignoring a directory OR
    // - `TEST_ONLY_PATTERN` is used to check a specific directory only
    .filter(
      pkg =>
        !TEST_ONLY_PATTERN ||
        pkg.startsWith(TEST_ONLY_PATTERN) ||
        (testOnlyIsRemovingPattern && !pkg.startsWith(TEST_ONLY_PATTERN)),
    );

  const coverageThresholdConfig = await Promise.all(
    changedPackagesRelativePaths.map(pkg =>
      readFile(`${cwd}/${pkg}/package.json`, 'utf8').then(changedPackage => {
        const { atlaskitCoverage = {} } = JSON.parse(changedPackage);
        return { atlaskitCoverage, pkg };
      }),
    ),
  );

  const atlaskitCoverageReducer = (result, { atlaskitCoverage, pkg }) => ({
    ...result,
    collectCoverageFrom: [
      ...result.collectCoverageFrom,
      `${pkg}/src/**/*.{js,jsx,ts,tsx}`,
    ],
    coverageThreshold: {
      ...result.coverageThreshold,
      ...(Object.keys(atlaskitCoverage).length > 0
        ? { [`${pkg}/src`]: atlaskitCoverage }
        : {}),
    },
  });

  const reducedData = coverageThresholdConfig
    .filter(({ atlaskitCoverage }) => Object.keys(atlaskitCoverage).length > 0)
    .reduce(atlaskitCoverageReducer, {
      collectCoverageFrom: [],
      coverageThreshold: {},
    });

  console.log(
    Object.keys(reducedData).length === 0 ? {} : JSON.stringify(reducedData),
  );
})();
