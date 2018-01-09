const bolt = require('bolt');
const path = require('path');
const packages = require('../utils/packages');

/**
 * NOTE: This returns the list of changed packages since master ONLY if they have been commited.
 * It will print them all out as a json array of relative paths
 * i.e: $ node build/ci-scripts/get.changed.packages.since.master.js
 *        ["packages/elements/avatar", "packages/elements/badge"]
 * */
(async () => {
  const cwd = process.cwd();
  const allPackages = await bolt.getWorkspaces({ cwd });
  const changedPackages = await packages.getChangedPackagesSinceMaster();
  const changedPackagesRelativePaths = changedPackages
    .map(pkg => {
      const boltPkg = allPackages.find(p => p.name === pkg);
      if (!boltPkg) return null;
      return path.relative(cwd, boltPkg.dir);
    })
    // we'll remove any packages we couldnt find in the repo, this might mean that a package was
    // deleted for example
    .filter(path => !!path);

  console.log(JSON.stringify(changedPackagesRelativePaths));
})();
