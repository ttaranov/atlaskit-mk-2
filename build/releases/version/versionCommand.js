/* eslint-disable no-console */
const chalk = require('chalk');
const pyarn = require('pyarn');
// TODO: Make these pull from the actual packages once we have a firm repo structure
const cli = require('../../utils/cli');
const git = require('../../utils/git');
const history = require('../history');
const createChangeset = require('./createChangeset');
const createChangesetCommit = require('./createChangesetCommit');

async function getChangedPackages() {
  const lastRelease = history.getLastRelease();
  const changedFiles = await git.getChangedFilesSince(lastRelease, true);
  const allPackages = (await pyarn.getWorkspaces());

  const fileNameToPackage = fileName => allPackages.find(pkg => fileName.startsWith(pkg.dir));
  const fileExistsInPackage = fileName => !!fileNameToPackage(fileName);
  const fileNameToPackageName = fileName => fileNameToPackage(fileName).name;

  return changedFiles
    .filter(fileName => fileExistsInPackage(fileName))
    .map(fileName => fileNameToPackageName(fileName))
    // filter, so that we have only unique packages
    .filter((pkgName, idx, packages) => packages.indexOf(pkgName) === idx);
}

async function run(opts) {
  const changedPackages = await getChangedPackages();
  const newVersion = await createChangeset(changedPackages);
  const versionCommitStr = createChangesetCommit(newVersion);

  console.log(chalk.green('Creating new version commit...\n'));
  console.log(versionCommitStr);
  const confirmCommit = await cli.askConfirm('Commit this Version?');

  if (confirmCommit) {
    await git.commit(versionCommitStr);
    console.log(chalk.green('Version committed!'));
  }
}

module.exports = run;
