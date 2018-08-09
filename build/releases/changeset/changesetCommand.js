/* eslint-disable no-console */
const { green, red } = require('chalk');
const boxen = require('boxen');
const outdent = require('outdent');
// TODO: Make these pull from the actual packages once we have a firm repo structure
const cli = require('../../utils/cli');
const git = require('../../utils/git');
const { getChangedPackagesSinceMaster } = require('../../utils/packages');
const createChangeset = require('./createChangeset');
const createChangesetCommit = require('./createChangesetCommit');

async function run() {
  printIntroBannerMessage();
  const changedPackages = await getChangedPackagesSinceMaster();
  const changePackagesName = changedPackages.map(pkg => pkg.name);
  const newChangeset = await createChangeset(changePackagesName);
  const changesetCommitStr = createChangesetCommit(newChangeset);

  printChangeset(newChangeset);

  const confirmCommit = await cli.askConfirm('Commit this Changeset?');

  if (confirmCommit) {
    await git.commit(changesetCommitStr);
    console.log(green('Changeset committed!'));
  }
}

// prettier-ignore
function printIntroBannerMessage() {
  const message = outdent`
    ${red('================ NOTE ================')}
    We have made some major changes to the release process.
    Please make sure you ${red('read this before continuing')}.

    You will now ${red('only')} be asked about packages you choose to bump.

    We will patch everything else that needs to be ${red('updated automatically')}.

    For any package you need to release beyond a patch, you should make
    an explicit changeset for that release.
    i.e. "summary: bumping major dependency on editor-core"

    For more info, reach out to Fabric Build.
  `;
  const prettyMessage = boxen(message, {
    borderStyle: 'double',
    align: 'center',
  });
  console.log(prettyMessage);
}
// prettier-ignore-end

// NOTE
// before
// only
// updated automatically

function printChangeset(changeset) {
  function getReleasesOfType(type) {
    return changeset.releases
      .filter(release => release.type === type)
      .map(release => release.name);
  }

  console.log('=== Releasing the following packages ===');
  const majorReleases = getReleasesOfType('major');
  const minorReleases = getReleasesOfType('minor');
  const patchReleases = getReleasesOfType('patch');

  if (majorReleases.length > 0) {
    console.log(`${green('[Major]')}\n  ${majorReleases.join(', ')}`);
  }
  if (minorReleases.length > 0) {
    console.log(`${green('[Minor]')}\n  ${minorReleases.join(', ')}`);
  }
  if (patchReleases.length > 0) {
    console.log(`${green('[Patch]')}\n  ${patchReleases.join(', ')}`);
  }
  if (changeset.dependents.length > 0) {
    const dependents = changeset.dependents.map(dep => dep.name);
    console.log(
      `${green('[Dependents (patch)]')}\n  ${dependents.join('\n  ')}`,
    );

    const message = outdent`
      ${red('========= NOTE ========')}
      All dependents that are bumped will be ${red('patch bumped')}.
      If any of the above need a higher bump than this, you will need to create a ${red(
        'separate changeset',
      )} for this
      Please read the above list ${red(
        'carefully',
      )} to make sure you're not missing anything!`;
    const prettyMessage = boxen(message, {
      borderStyle: 'double',
      align: 'center',
    });
    console.log(prettyMessage);
  }
}

module.exports = run;
