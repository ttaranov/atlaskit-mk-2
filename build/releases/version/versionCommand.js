const path = require('path');
const bolt = require('bolt');
const logger = require('@atlaskit/build-utils/logger');
const git = require('@atlaskit/build-utils/git');
const createRelease = require('./createRelease');
const createReleaseCommit = require('./createReleaseCommit');
const changelog = require('../changelog');
const fs = require('@atlaskit/build-utils/fs');

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
  const noChangelogFlag = opts.noChangelog;
  const allPackages = await bolt.getWorkspaces({ cwd });

  const lastPublishCommit = await git.getLastPublishCommit();
  // getUnpublishedChangesetCommits takes a 'since' flag, we do commits since last publish
  const unreleasedChangesets = await git.getUnpublishedChangesetCommits(
    lastPublishCommit,
  );

  const releaseObj = createRelease(unreleasedChangesets, allPackages);
  const publishCommit = createReleaseCommit(releaseObj);

  if (unreleasedChangesets.length === 0) {
    logger.warn('No unreleased changesets found, exiting.');
    return;
  }

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

  // This double negative is bad, but cleaner than the alternative
  if (!noChangelogFlag) {
    logger.log('Updating changelogs...');
    // Now update the changelogs
    const changelogPaths = await changelog.updateChangelog(releaseObj, { cwd });
    for (let changelogPath of changelogPaths) {
      await git.add(changelogPath);
    }
  }

  logger.log('Committing changes...');
  // TODO: Check if there are any unstaged changed before committing and throw
  // , as it means something went super-odd.
  await git.commit(publishCommit);
}

module.exports = run;
