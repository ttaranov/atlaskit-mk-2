const path = require('path');
const pyarn = require('pyarn');
const cli = require('../../utils/cli');
const logger = require('../../utils/logger');
const git = require('../../utils/git');
const isRunningInPipelines = require('../../utils/isRunningInPipelines');
const parseChangesetCommit = require('../version/parseChangeSetCommit');
const createRelease = require('../version/createRelease');
const createReleaseCommit = require('../version/createReleaseCommit');
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
  const allPackages = await pyarn.getWorkspaces({ cwd });
  const lastPublishCommit = await git.getLastPublishCommit();
  const unreleasedChangesetCommits = await git.getChangesetCommitsSince(lastPublishCommit);
  const commits = await Promise.all(unreleasedChangesetCommits.map(commit => git.getFullCommit(commit)));
  const unreleasedChangesets = commits
    .map(({ commit, message }) => ({ commit, ...parseChangesetCommit(message) }));
  if (unreleasedChangesets.length === 0) {
    logger.warn(`No unreleased changesets found since ${lastPublishCommit}. Exiting`);
    return;
  }
  const releaseObj = createRelease(unreleasedChangesets, allPackages);

  await bumpReleasedPackages(releaseObj, allPackages);

  const publishCommit = createReleaseCommit(releaseObj);

  /** TODO: Update changelogs here */
  // changelog.updateChangeLog(releaseObj);

  logger.log(publishCommit);

  const runPublish = isRunningInPipelines() || await cli.askConfirm('Publish these packages?');

  if (runPublish) {
    logger.log('Committing changes...');
    const committed = await git.commit(publishCommit);

    logger.log('Pushing back to origin...');
    const pushed = committed && await git.push();

    if (pushed) {
      const published = await pyarn.publish({ access: 'public' });
      if (published) {
        const releasedPackages = releaseObj.releases.map(r => `${r.name}@${r.version}`).join('\n');
        logger.success('Successfully published:');
        logger.success(releasedPackages);
      }
    }
  }
}

module.exports = {
  run,
};
