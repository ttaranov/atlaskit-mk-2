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

async function run(opts) {
  const cwd = opts.cwd || process.cwd();
  const allPackages = await bolt.getWorkspaces({ cwd });
  const maxGitRetries = 3;

  // need to rebase before getUnpublishedChangesetCommits otherwise we might re-pick up released
  // packages. Failing to rebase here is safe, we can throw and the next build will release for us.
  logger.info("Rebasing to make sure we aren't behind in commits...");
  git.rebase(maxGitRetries);

  const unreleasedChangesets = await git.getUnpublishedChangesetCommits();

  if (unreleasedChangesets.length === 0) {
    logger.warn(`No unreleased changesets found. Exiting`);
    return;
  }
  const releaseObj = createRelease(unreleasedChangesets, allPackages);
  const publishCommit = createReleaseCommit(releaseObj);

  const changelogPaths = await changelog.updateChangelog(releaseObj, { cwd });

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
    const pkgPaths = await bolt.updatePackageVersions(versionsToUpdate, {
      cwd,
    });
    // TODO: get updatedPackages from bolt.updatePackageVersions and only add those
    // as well as the changelogPaths

    for (let changelogPath of changelogPaths) {
      await git.add(changelogPath);
    }
    for (let pkgPath of pkgPaths) {
      await git.add(pkgPath);
    }

    logger.log('Committing changes...');
    // TODO: Check if there are any unstaged changed before committing and throw
    // , as it means something went super-odd.
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
      await git.rebaseAndPush(maxGitRetries);
    }
  }
}

module.exports = {
  run,
};
