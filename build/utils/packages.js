// @flow

const path = require('path');
const bolt = require('bolt');
const git = require('../utils/git');

async function getChangedPackagesSinceCommit(commit) {
  const changedFiles = await git.getChangedFilesSince(commit, true);
  const allPackages = await bolt.getWorkspaces();

  const fileNameToPackage = fileName =>
    allPackages.find(pkg => fileName.startsWith(pkg.dir + path.sep));
  const fileExistsInPackage = fileName => !!fileNameToPackage(fileName);
  const fileNameToPackageName = fileName => fileNameToPackage(fileName).name;

  return (
    changedFiles
      .filter(fileName => fileExistsInPackage(fileName))
      .map(fileName => fileNameToPackageName(fileName))
      // filter, so that we have only unique packages
      .filter((pkgName, idx, packages) => packages.indexOf(pkgName) === idx)
  );
}

async function getChangedPackagesSincePublishCommit() {
  const lastRelease = await git.getLastPublishCommit();
  return getChangedPackagesSinceCommit(lastRelease);
}

// Note: This returns the packages that have changed AND been committed since master,
// it wont include staged/unstaged changes
async function getChangedPackagesSinceMaster() {
  const masterRef = await git.getMasterRef();
  return getChangedPackagesSinceCommit(masterRef);
}

module.exports = {
  getChangedPackagesSincePublishCommit,
  getChangedPackagesSinceMaster,
};
