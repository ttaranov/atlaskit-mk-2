/* eslint-disable no-console */
const chalk = require('chalk');
const pyarn = require('pyarn');
// TODO: Make these pull from the actual packages once we have a firm repo structure
const cli = require('../../utils/cli');
const git = require('../../utils/git');
const createChangeset = require('./createChangeset');
const createChangesetCommit = require('./createChangesetCommit');

async function getChangedPackages() {
  const lastRelease = await git.getLastPublishCommit();
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

async function run() {
  const changedPackages = await getChangedPackages();
  const newChangeset = await createChangeset(changedPackages);
  const changesetCommitStr = createChangesetCommit(newChangeset);

  console.log(chalk.green('Creating new Changeset commit...\n'));
  console.log(changesetCommitStr);
  const confirmCommit = await cli.askConfirm('Commit this Changeset?');

  if (confirmCommit) {
    await git.commit(changesetCommitStr);
    console.log(chalk.green('Changeset committed!'));
  }
}

module.exports = run;
