/* eslint-disable no-console */
const Enquirer = require('enquirer');
const glob = require('glob');
const spawn = require('projector-spawn');
const path = require('path');
const uuid = require('uuid/v1');
const historyFile = require('./history-file');

const enquirer = new Enquirer();
enquirer.register('confirm', require('prompt-confirm'));
enquirer.register('radio', require('prompt-radio'));

async function updateOldRelease(history, commits, changedPackages) {
  const releaseToUpdate = history.releases[0];
  const commitsToRemove = releaseToUpdate.commits.filter(commit => !commits.includes(commit));
  const releaseVersions = [];
  if (commitsToRemove.length > 0) {
    console.warn(`${commitsToRemove.length} commits found in history.yml that are not in recent git logs`);
    console.warn('The following commits will be removed from history.yml');
    console.warn(commitsToRemove); // TODO: Pretty print these with their commit messages too
    const resp = await askConfirmation('Confirm?');
    if (!resp) { return; }
  }
  for (const pkgName of changedPackages) {
    const defaultBumpType = getBumpTypeFromVersionsArr(releaseToUpdate.versions, pkgName);
    console.log(`bump type ${defaultBumpType}`);
    const releaseType = await (promptForReleaseType(pkgName, defaultBumpType));
    if (releaseType !== 'None') {
      releaseVersions.push(`${pkgName}@${releaseType}`);
    }
  }

  // we'll ignore adding names and releases files for now and override the last release
  history.releases[0] = {
    commits,
    versions: releaseVersions,
  };
  historyFile.writeHistoryFile(history);
}

// returns the bump type (patch, minor, major or undefined) for a package give the `versions` array from
// history i.e ['build/releases@minor', 'components/badge@patch'].
// Returns undefined if no release existed for that package
function getBumpTypeFromVersionsArr(versions, pkgName) {
  if (!versions) { return undefined; }
  const previousBumpType = versions.filter(versStr => versStr.startsWith(pkgName))
    .map(versStr => versStr.split('@')[1]);
  if (previousBumpType.length > 0) { return previousBumpType[0]; }
  return undefined;
}

async function promptForReleaseType(packageName, defaultSelected) {
  const releaseTypes = ['None', 'patch', 'minor', 'major'];
  const questionConfig = { type: 'radio', choices: releaseTypes, default: defaultSelected || 'None' };
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

// TODO: Move all these to a package
async function askConfirmation(question) {
  // need a random key so we dont conflict with other questions
  const questionKey = `Confirm-${uuid()}`;
  enquirer.question(questionKey, question, { type: 'confirm' });
  const responses = (await enquirer.ask(questionKey));
  // the responce we get back contains all of the responses to all questions we've asked, so just
  // return the answer to our question
  return responses[questionKey];
}

async function run(opts) {
  const history = await historyFile.getHistory(opts);
  const lastReleaseHash = history['last-release'];
  const commits = await getCommitsSince(lastReleaseHash);
  const changedFiles = await getChangedFilesSince(lastReleaseHash);
  // we'll hard code this for now so that we can keep testing
  // const changedPackages = getChangedPackagesFromChangedFiles(changedFiles);
  const changedPackages = ['build/releases', 'components/badge'];
  if (commits.length === 0) {
    console.log('No new commits since the last release. Exiting');
    process.exit(0);
  }
  if (changedPackages.length === 0) {
    console.log('No files have changed in a package - no need to create a release');
    process.exit(0);
  }
  // check if we are creating a new release or modifying last one
  if (history.releases[0].commits.includes(lastReleaseHash)) {
    console.log(`${commits.length} new commits affecting ${changedPackages.length} packages found that are not in a version`);
    const resp = await askConfirmation('Create new version?');
    if (!resp) { return; }

    // we'll push an empty release onto history and continue as if we were updating an old one
    history.releases.unshift({ commits: [], versions: [] });
  } else {
    console.log('New release already in progress, updating');
  }

  return updateOldRelease(history, commits, changedPackages, opts);
}

module.exports.run = run;
