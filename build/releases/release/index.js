const path = require('path');
const bolt = require('bolt');
const cli = require('../../utils/cli');
const logger = require('../../utils/logger');
const git = require('../../utils/git');
const isRunningInPipelines = require('../../utils/isRunningInPipelines');
const parseChangesetCommit = require('../changeset/parseChangesetCommit');
const createRelease = require('../changeset/createRelease');
const createReleaseCommit = require('../changeset/createReleaseCommit');
const changelog = require('../changelog');
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

function logReleases(status, pkgs) {
  const mappedPkgs = pkgs.map(p => `${p.name}@${p.newVersion}`).join('\n');
  logger.success(`Packages ${status} published:`);
  logger.log(mappedPkgs);
}

async function run(opts) {
  const cwd = opts.cwd || process.cwd();
  const allPackages = await bolt.getWorkspaces({ cwd });

  const unreleasedChangesets = await git.getUnpublishedChangesetCommits();

  const releaseObj = createRelease(unreleasedChangesets, allPackages);
  const publishCommit = createReleaseCommit(releaseObj);
  logger.log(publishCommit);

  if (unreleasedChangesets.length === 0) {
    logger.warn('No unreleased changesets found.');
  }

  // in the future we will expose the ability to update files/changelogs without being in CI
  // for now, we'll just exit
  if (!isRunningInPipelines()) {
    return;
  }

  // if we have packages that need to be changed
  if (unreleasedChangesets.length > 0) {
    // update local package versions
    await bumpReleasedPackages(releaseObj, allPackages);
    // Need to transform releases into a form for bolt to update dependencies
    const versionsToUpdate = releaseObj.releases.reduce(
      (cur, next) => ({
        ...cur,
        [next.name]: next.version,
      }),
      {},
    );
    // update dependencies on those versions using bolt
    const pkgPaths = await bolt.updatePackageVersions(versionsToUpdate, {
      cwd,
    });

    for (let pkgPath of pkgPaths) {
      await git.add(pkgPath);
    }

    // Now update the changelogs
    const changelogPaths = await changelog.updateChangelog(releaseObj, { cwd });
    for (let changelogPath of changelogPaths) {
      await git.add(changelogPath);
    }

    logger.log('Committing changes...');
    // TODO: Check if there are any unstaged changed before committing and throw
    // , as it means something went super-odd.
    await git.commit(publishCommit);

    // we push back before publishing because it's easier to recover from being ahead of npm than
    // behind
    logger.log('Pushing changes back to origin...');
    const maxRetries = 3;
    await git.rebaseAndPush(maxRetries);
  }

  // We always run publish even if we didnt have any packages we know we are publishing (a previous)
  // failed build might have bumped packages but not released them.
  const packages = await bolt.publish({ access: 'public' });
  let successfullyPublished = [];
  let failedToPublish = [];
  for (let p of packages) {
    if (p.published) successfullyPublished.push(p);
    else failedToPublish.push(p);
  }

  if (successfullyPublished.length > 0) {
    logReleases('successfully', successfullyPublished);
  }

  if (failedToPublish.length > 0) {
    logReleases('failed to', failedToPublish);
    throw new Error(`Some releases failed: ${JSON.stringify(packages)}`);
  }
}

module.exports = {
  run,
};
