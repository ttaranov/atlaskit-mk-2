// @flow

const path = require('path');
const bolt = require('bolt');
const git = require('../utils/git');

async function getChangedPackagesSinceCommit(commit) {
  const changedFiles = await git.getChangedFilesSince(commit, true);
  const project = await bolt.getProject();
  const projectDir = project.dir;
  const workspaces = await bolt.getWorkspaces();
  // we'll add the relativeDir's to these so we have more information to work from later
  const allPackages = workspaces.map(pkg => ({
    ...pkg,
    relativeDir: path.relative(projectDir, pkg.dir),
  }));

  const fileNameToPackage = fileName =>
    allPackages.find(pkg => fileName.startsWith(pkg.dir + path.sep));
  const fileExistsInPackage = fileName => !!fileNameToPackage(fileName);

  return (
    changedFiles
      // ignore deleted files
      .filter(fileName => fileExistsInPackage(fileName))
      .map(fileName => fileNameToPackage(fileName))
      // filter, so that we have only unique packages
      .filter((pkg, idx, packages) => packages.indexOf(pkg) === idx)
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
