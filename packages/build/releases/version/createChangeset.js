const chalk = require('chalk');

const cli = require('../../utils/cli');
const createReleaseNotesFile = require('./createReleaseNotesFile');

/* Version object format (TODO: User flow!!!)
  {
    summary: 'This is the summary',
    releaseNotes?: 'path/to/release/notes.md',   // optional
    releases: [
      { name: pkgName, type: bumpType }
    ],
    dependents: [
      { name: pkgName, type: bumpType, dependencies: ['pkg-a', 'pkg-b'] }
    ]
  }
*/

async function createVersionObject(changedPackages) {
  const newVersion = {
    summary: '',
    releases: [],
    dependents: [],
  };

  const packagesToInclude = await cli.askCheckbox('Which packages would you like to include?', changedPackages);

  for (const pkg of packagesToInclude) {
    const bumpType = await cli.askList(`What kind of change is this for ${chalk.green(pkg)}?`, ['patch', 'minor', 'major']);
    newVersion.releases.push({ name: pkg, type: bumpType });
  }

  /**
   *  Get all dependents and ask bump types
   */

  console.log('Please enter a summary for this change (this will be in the changelogs)');
  const summary = await cli.askQuestion('Summary');

  if (Object.values(newVersion.releases).some(bump => bump === 'major')) {
    console.log('You are making a breaking change, you\'ll need to create new release file to document this');
    console.log('(you can set you $EDITOR variable to control which editor will be used)');

    await cli.askConfirm('Create new release?'); // This is really just to let the user read the message above
    const newReleasePath = createReleaseNotesFile('new-release.md', summary); // hard-coding here, but we should prompt for it
    await cli.askEditor(newReleasePath);
    newVersion.releaseNotes = newReleasePath;
  }

  newVersion.summary = summary;
  return newVersion;
}

module.exports = createVersionObject;
