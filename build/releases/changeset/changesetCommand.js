/* eslint-disable no-console */
const chalk = require('chalk');
// TODO: Make these pull from the actual packages once we have a firm repo structure
const cli = require('../../utils/cli');
const git = require('../../utils/git');
const { getChangedPackagesSinceMaster } = require('../../utils/packages');
const createChangeset = require('./createChangeset');
const createChangesetCommit = require('./createChangesetCommit');

async function run() {
  const changedPackages = await getChangedPackagesSinceMaster();
  const changePackagesName = changedPackages.map(pkg => pkg.name);
  const newChangeset = await createChangeset(changePackagesName);
  const changesetCommitStr = createChangesetCommit(newChangeset);

  console.log(chalk.green('Creating new Changeset commit...\n'));
  const confirmCommit = await cli.askConfirm('Commit this Changeset?');

  if (confirmCommit) {
    await git.commit(changesetCommitStr);
    console.log(chalk.green('Changeset committed!'));
  }
}

module.exports = run;
