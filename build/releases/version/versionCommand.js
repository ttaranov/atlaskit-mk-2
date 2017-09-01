/* eslint-disable no-console */
const chalk = require('chalk');
const pyarn = require('pyarn');
// TODO: Make these pull from the actual packages once we have a firm repo structure
const cli = require('../../utils/cli');
const git = require('../../utils/git');
const history = require('../history');
const createVersionCommitStr = require('./createVersionCommitStr');
const createNewReleaseDoc = require('./createNewReleaseDoc');

async function promptForNewVersion(changedPackages) {
  const newVersion = {
    summary: '',
    releases: {},
    doc: '',
    dependents: {},
  };

  const packagesToInclude = await cli.askCheckbox('Which packages would you like to include?', changedPackages);

  for (const pkg of packagesToInclude) {
    newVersion.releases[pkg] = await cli.askList(`What kind of change is this for ${chalk.green(pkg)}?`,
      ['patch', 'minor', 'major']);
  }

  console.log('Please enter a summary for this change (this will be in the changelogs)');
  const summary = await cli.askQuestion('Summary');

  if (Object.values(newVersion.releases).some(bump => bump === 'major')) {
    console.log('You are making a breaking change, you\'ll need to create new release file to document this');
    console.log('(you can set you $EDITOR variable to control which editor will be used)');

    await cli.askConfirm('Create new release?'); // This is really just to let the user read the message above
    const newReleasePath = createNewReleaseDoc('new-release.md', summary); // hard-coding here, but we should prompt for it
    await cli.askEditor(newReleasePath);
    newVersion.doc = newReleasePath;
  }

  newVersion.summary = summary;
  return newVersion;
}

async function getChangedPackages() {
  const lastRelease = history.getLastRelease();
  const changedFiles = await git.getChangedFilesSince(lastRelease, true);
  const allPackages = (await pyarn.getPackages());

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
  const newVersion = await promptForNewVersion(changedPackages);
  const versionCommitStr = createVersionCommitStr(newVersion);

  console.log(chalk.green('Creating new version commit...\n'));
  console.log(versionCommitStr);
  const confirmCommit = await cli.askConfirm('Commit this Version?');

  if (confirmCommit) {
    await git.commit(versionCommitStr);
    console.log(chalk.green('Version committed!'));
  }
}

module.exports = run;
