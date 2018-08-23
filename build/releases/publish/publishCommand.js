/* eslint-disable */
const bolt = require('bolt');
const logger = require('../../utils/logger');
const git = require('../../utils/git');

function logReleases(status, pkgs) {
  const mappedPkgs = pkgs.map(p => `${p.name}@${p.newVersion}`).join('\n');
  logger.success(`Packages ${status} published:`);
  logger.log(mappedPkgs);
}

async function run(opts) {
  const cwd = opts.cwd || process.cwd();
  const response = await bolt.publish({});

  const successful = response.filter(p => p.published);
  const unsuccessful = response.filter(p => !p.published);

  if (successful.length > 0) {
    logReleases('successfully', successful);
    // We create the tags after the push above so that we know that HEAD wont change and that pushing
    // wont suffer from a race condition if another merge happens in the mean time (pushing tags wont
    // fail if we are behind master).
    logger.log('Creating tags...');
    for (let pkg of successful) {
      const tag = `${pkg.name}@${pkg.newVersion}`;
      logger.log('New tag: ', tag);
      await git.tag(tag);
    }

    logger.log('Pushing tags...');
    // We have tried a lot of iterations of this command, here is the reasoning for each:
    // Originally we had `git push --tags` and this failed to push non-annotated commits
    // Then we moved to `git push --follow-tags` which pushes our HEAD ref as well. This one fails if
    // we are behind current master
    // Finally we came back to `git push --tags` but with annotated tags (`git tag tagName -m tagMsg`)
    // and this should finally work
    await git.push(['--tags']);
  }

  if (unsuccessful.length > 0) {
    logReleases('failed to', unsuccessful);
    throw new Error(`Some releases failed: ${JSON.stringify(response)}`);
  }
}

module.exports = run;
