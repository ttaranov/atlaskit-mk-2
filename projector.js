// @flow

const chalk = require('chalk');
const release = require('./build/releases/release');
const karma = require('projector-karma');
const {
  getKarmaConfig,
  getPackagesWithKarmaTests,
} = require('./build/karma-config');
const { getChangedPackagesSinceMaster } = require('./build/utils/packages');

exports.release = async () => {
  await release.run({ cwd: __dirname });
};

const runKarma = async ({ watch, browserstack }) => {
  const config = await getKarmaConfig({
    cwd: process.cwd(),
    watch,
    browserstack,
  });
  await karma.run({ config, files: [] });
};

exports.testBrowser = async (
  { watch, browserstack } /*: { watch: boolean, browserstack: boolean }*/,
) => {
  await runKarma({ watch, browserstack });
};

exports.testBrowserCI = async (
  { watch, browserstack } /*: { watch: boolean, browserstack: boolean }*/,
) => {
  const changedPackages = await getChangedPackagesSinceMaster();
  const changedPackagesNames = changedPackages.map(pkg => pkg.name);
  const packagesWithKarmaTests = await getPackagesWithKarmaTests();
  const changedPackagesWithKarmaTests = packagesWithKarmaTests.filter(
    pkg => changedPackagesNames.indexOf(pkg) !== -1,
  );

  if (!changedPackagesWithKarmaTests.length) {
    // eslint-disable-next-line
    console.log(
      chalk.blue(
        'Skip karma – none of the changed packages has karma tests...',
      ),
    );
  } else {
    await runKarma({ watch, browserstack });
  }
};
