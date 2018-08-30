/* eslint-disable */
const bolt = require('bolt');
const logger = require('@atlaskit/build-utils/logger');
const git = require('@atlaskit/build-utils/git');

function logReleases(status, pkgs) {
  const mappedPkgs = pkgs.map(p => `${p.name}@${p.newVersion}`).join('\n');
  logger.success(`Packages ${status} published:`);
  logger.log(mappedPkgs);
}

async function run(opts) {
  const cwd = opts.cwd || process.cwd();
  const publishOpts = {};
  // if not public, we wont pass the access, and it works as normal
  if (opts.publicFlag) publishOpts.access = 'public';
  const response = await bolt.publish(publishOpts);

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
  }

  if (unsuccessful.length > 0) {
    logReleases('failed to', unsuccessful);
    throw new Error(`Some releases failed: ${JSON.stringify(response)}`);
  }
}

module.exports = run;
