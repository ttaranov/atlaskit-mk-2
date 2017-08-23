const Enquirer = require('enquirer');
const glob = require('glob');
const spawn = require('projector-spawn');
const path = require('path');
const historyFile = require('./history-file');

const enquirer = new Enquirer();
enquirer.register('confirm', require('prompt-confirm'));
enquirer.register('radio', require('prompt-radio'));

async function createNewRelease(history, commits, changedPackages, opts) {
  const releaseVersions = [];
  for (const pkgName of changedPackages) {
    const releaseType = await (promptForReleaseType(pkgName));
    if (releaseType !== 'None') {
      releaseVersions.push(`${pkgName}@${releaseType}`);
    }
  }
  // we'll ignore adding names and releases files for now
  const newRelease = {
    commits,
    versions: releaseVersions,
  };
  historyFile.
}

function updateOldRelease() {

}

async function promptForName() {

}

async function promptForReleaseType(packageName) {
  const releaseTypes = ['None', 'patch', 'minor', 'major'];
  const questionConfig = { type: 'radio', choices: releaseTypes, default: 'None' };
  const questionKey = `release-type-for-${packageName}`;
  enquirer.question(questionKey, `Release type for ${packageName}`, questionConfig);
  const answers = await enquirer.ask(questionKey);
  // enquirer returns the entire answer list each time you ask a question, so we just return ours
  return answers[questionKey];
}

async function getCommitsSince(commitHash) {
  const gitCmd = await spawn('git', ['rev-list', '--no-merges', '--abbrev-commit', `${commitHash}..HEAD`]);
  return gitCmd.stdout.trim().split('\n');
}

async function getChangedFilesSince(commitHash) {
  const gitCmd = await spawn('git', ['diff', '--name-only', `${commitHash}..HEAD`]);
  return gitCmd.stdout.trim().split('\n');
}

async function getBranchName() {
  const gitCmd = await spawn('git', ['rev-parse', '--abrev-ref', 'HEAD']);
  return gitCmd.stdout.trim().split('\n');
}

function getChangedPackagesFromChangedFiles(changedFiles) {
  const allPackages = getAllPackages();
  return changedFiles
    // filter out files that dont belong to a package
    .filter(fileName => allPackages.some(pkg => fileName.startsWith(pkg)))
    // then map each one to their package
    .map(fileName => allPackages.find(pkg => fileName.startsWith(pkg)))
    // filter, so that we have only unique packages
    .filter((pkgName, idx) => allPackages.indexOf(pkgName) === idx);
}

function getAllPackages() {
  const rootPkgJson = getRootPackageJson();
  const packageDirs = rootPkgJson.pworkspaces
    .map(workSpaceGlob => glob.sync(workSpaceGlob))
    .reduce((acc, cur) => acc.concat(cur), []);

  return packageDirs;
}

function getRootPackageJson() {
  // TODO: Make this cleaner and put in utils
  const rootPkgJson = require(path.join(__dirname, '..', '..', 'package.json'));
  return rootPkgJson;
}

function shouldCreateNewHistory(history, commitsSinceLastRelease, changedPackages) {
  const lastReleaseHash = history['last-release'];
  // Only need to check the most recent release for the last-release hash
  if (commitsSinceLastRelease.length === 0) {
    console.log('No new commits since the last release. Exiting');
    return false;
  }
  if (history.releases[0].commits.includes(lastReleaseHash)) {
    console.log('Last release includes lastRelease commit - modifying last release');
    return false;
  }
  if (changedPackages.length === 0) {
    console.log('No files have changed in a package - no need to create a release');
    return false;
  }
  return true;
}

async function run(opts) {
  const history = await historyFile.getHistory(opts);
  const lastReleaseHash = history['last-release'];
  const commits = await getCommitsSince(lastReleaseHash);
  const changedFiles = await getChangedFilesSince(lastReleaseHash);
  // we'll hard code this for now so that we can keep testing
  // const changedPackages = getChangedPackagesFromChangedFiles(changedFiles);
  const changedPackages = ['build/releases', 'components/badge'];

  if (commits.length > 0) {
    if (shouldCreateNewHistory(history, commits, changedPackages)) {
      console.log(`${commits.length} new commits affecting ${changedPackages.length} packages found that are not in a version`);
      enquirer.question('CreateNew', 'Create new version?', { type: 'confirm' });
      const resp = await enquirer.ask('CreateNew');
      if (resp) {
        return createNewRelease(history, commits, changedPackages, opts);
      }
      return resp;
    }
  } else {
  }
}

module.exports.run = run;
