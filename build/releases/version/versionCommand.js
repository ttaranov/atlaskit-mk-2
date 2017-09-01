const chalk = require('chalk');
const pyarn = require('pyarn');
// TODO: Make these pull from the actual packages once we have a firm repo structure
const cli = require('../../utils/cli');
const git = require('../../utils/git');
const history = require('../history');

async function promptForNewVersion(changedPackages) {
  const bumpTypes = {};

  const packagesToInclude = await cli.askCheckbox('Which packages would you like to include?', changedPackages);

  for (const pkg of packagesToInclude) {
    bumpTypes[pkg] = await cli.askList(`What kind of change is this for ${chalk.green(pkg)}?`, ['patch', 'minor', 'major']);
  }

  console.log('Please enter a summary for this change (this will be in the changelogs)');
  const summary = await cli.askQuestion('Summary');

  return {
    releases: bumpTypes,
    summary,
  };
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

  console.log('New version created!');
  console.log(newVersion);
}

module.exports = run;
