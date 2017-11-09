/* eslint-disable no-console */
const chalk = require('chalk');
const bolt = require('bolt');

const cli = require('../../utils/cli');
const logger = require('../../utils/logger');
const createReleaseNotesFile = require('./createReleaseNotesFile');

/* Changeset object format (TODO: User flow!!!)
  {
    summary: 'This is the summary',
    releaseNotes?: 'path/to/release/notes.md',   // optional
    releases: [
      { name: pkg-a, type: bumpType }
    ],
    dependents: [
      { name: pkg-b, type: bumpType, dependencies: ['pkg-a', 'pkg-c'] }
      { name: pkg-c, type: bumpType, dependencies: ['pkg-a'] }
    ]
  }
*/

async function getAllDependents(packagesToRelease, opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const allDependents = [];
  const dependentsGraph = await bolt.getDependentsGraph(cwd);
  const dependenciesToCheck = [...packagesToRelease];

  while (dependenciesToCheck.length > 0) {
    const nextDependency = dependenciesToCheck.pop();
    const dependents = dependentsGraph.get(nextDependency);

    dependents.forEach(dependent => {
      const foundBefore = allDependents.find(d => d.name === dependent);
      if (!foundBefore) {
        allDependents.push({ name: dependent, dependencies: [nextDependency] });
        dependenciesToCheck.push(dependent);
      } else if (!foundBefore.dependencies.includes(nextDependency)) {
        foundBefore.dependencies.push(nextDependency);
      }
    });
  }

  return allDependents;
}

async function createChangeset(changedPackages, opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const changeset = {
    summary: '',
    releases: [],
    dependents: [],
  };

  const packagesToRelease = await cli.askCheckbox('Which packages would you like to include?', changedPackages);

  /** Get released packages and bumptypes */

  for (const pkg of packagesToRelease) {
    const bumpType = await cli.askList(`What kind of change is this for ${chalk.green(pkg)}?`, ['patch', 'minor', 'major']);
    changeset.releases.push({ name: pkg, type: bumpType });
  }

  /** Get summary for changeset */

  logger.log('Please enter a summary for this change (this will be in the changelogs)');
  const summary = await cli.askQuestion('Summary');

  /** Get dependents and bumptypes */

  const dependents = await getAllDependents(packagesToRelease, { cwd });

  for (const dependent of dependents) {
    const dependenciesList = chalk.green(dependent.dependencies.join(', '));
    const dependentName = chalk.green(dependent.name);
    logger.log(`Bumping [${dependenciesList}] will cause an update to ${dependentName}'s dependencies.`);
    const bumpType = await cli.askList(`What kind of change is this for ${dependentName}?`, ['patch', 'minor', 'major']);
    dependent.type = bumpType;
  }

  /** Get releaseNotes if there is a major change */

  if (Object.values(changeset.releases).some(bump => bump.type === 'major')) {
    logger.log('You are making a breaking change, you\'ll need to create new release file to document this');
    logger.log('(you can set you $EDITOR variable to control which editor will be used)');

    await cli.askConfirm('Create new release?'); // This is really just to let the user read the message above
    const newReleasePath = createReleaseNotesFile('new-release.md', summary); // hard-coding here, but we should prompt for it
    await cli.askEditor(newReleasePath);
    changeset.releaseNotes = newReleasePath;
  }

  changeset.summary = summary;
  changeset.dependents = dependents;

  return changeset;
}

module.exports = createChangeset;
