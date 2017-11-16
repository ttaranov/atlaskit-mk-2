const path = require('path');
const bolt = require('bolt');
const cli = require('../../utils/cli');
const logger = require('../../utils/logger');
const git = require('../../utils/git');
const isRunningInPipelines = require('../../utils/isRunningInPipelines');
const parseChangesetCommit = require('../changeset/parseChangesetCommit');
const createRelease = require('../changeset/createRelease');
const createReleaseCommit = require('../changeset/createReleaseCommit');
const fs = require('../../utils/fs');

async function bumpReleasedPackages(releaseObj, allPackages) {
  for (const release of releaseObj.releases) {
    const pkgDir = allPackages.find(pkg => pkg.name === release.name).dir;
    const pkgJsonPath = path.join(pkgDir, 'package.json');
    const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath));

    pkgJson.version = release.version;
    const pkgJsonStr = `${JSON.stringify(pkgJson, null, 2)}\n`;
    await fs.writeFile(pkgJsonPath, pkgJsonStr);
    await git.add(pkgJsonPath);
  }
}

async function run(opts) {
  const cwd = opts.cwd || process.cwd();
  const allPackages = await bolt.getWorkspaces({ cwd });
  const unreleasedChangesets = await git.getUnpublishedChangesetCommits();

  if (unreleasedChangesets.length === 0) {
    logger.warn(`No unreleased changesets found. Exiting`);
    return;
  }
  const releaseObj = createRelease(unreleasedChangesets, allPackages);
  const publishCommit = createReleaseCommit(releaseObj);

  const changelogPaths = await changelog.updateChangeLog(releaseObj);

  logger.log(publishCommit);

  const runPublish =
    isRunningInPipelines() || (await cli.askConfirm('Publish these packages?'));
  if (runPublish) {
    // update package versions
    await bumpReleasedPackages(releaseObj, allPackages);
    // Need to transform releases into a form for bolt to update dependencies
    const versionsToUpdate = releaseObj.releases.reduce(
      (cur, next) => ({
        ...cur,
        [next.name]: next.version,
      }),
      {},
    );
    // update dependencies on those versions
    await bolt.updatePackageVersions(versionsToUpdate);
    // TODO: get updatedPackages from bolt.updatePackageVersions and only add those
    // as well as the changelogPaths
    await git.add('.');

    logger.log('Committing changes...');
    // TODO: We should probably to a 'can fast forward' check here so we know if our push is going
    // to succeed before hand. Just means we can have a slightly more informative error message
    const committed = await git.commit(publishCommit);

    if (committed) {
      // bolt will throw if there is an error
      await bolt.publish({ access: 'public' });

      const releasedPackages = releaseObj.releases
        .map(r => `${r.name}@${r.version}`)
        .join('\n');
      logger.success('Successfully published:');
      logger.log(releasedPackages);

      logger.log('Pushing changes back to origin...');
      await git.push();
    }
  }
}

module.exports = {
  run,
};
