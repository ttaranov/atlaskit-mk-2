// @flow

const path = require('path');
const bolt = require('bolt');
const git = require('../utils/git');

async function getChangedPackages() {
  const lastRelease = await git.getLastPublishCommit();
  const changedFiles = await git.getChangedFilesSince(lastRelease, true);
  const allPackages = await bolt.getWorkspaces();

  const fileNameToPackage = fileName => allPackages.find(pkg => fileName.startsWith(pkg.dir));
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

module.exports = { getChangedPackages };
