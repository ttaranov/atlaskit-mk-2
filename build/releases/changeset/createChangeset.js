/* eslint-disable no-console */
// @flow

const chalk = require('chalk');
const bolt = require('bolt');

const cli = require('../../utils/cli');
const logger = require('../../utils/logger');
const createReleaseNotesFile = require('./createReleaseNotesFile');
const promptAndAssembleReleaseTypes = require('./promptAndAssembleReleaseTypes');
const inquirer = require('inquirer');

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

/*::
type releaseType = {
  name: string,
  type: string,
}
type dependentType = {
  name: string,
  type?: string,
  dependencies: Array<string>,
  dependents: Array<string>,
  finalised?: boolean,
  updateCause?: string[],
}
type dependents = {
  [dependent: string]: dependentType,
}
type changesetDependentType = {
  name: string,
  type?: string,
}
type changesetType = {
  summary: string,
  releases: Array<releaseType>,
  dependents: Array<changesetDependentType>,
  releaseNotes?: any,
}
*/

async function getAllDependents(packagesToRelease, opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const allDependents = {};
  const dependentsGraph = await bolt.getDependentsGraph({ cwd });
  const dependencyGraph = await bolt.getDependencyGraph({ cwd });

  const dependenciesToCheck = [...packagesToRelease];
  while (dependenciesToCheck.length > 0) {
    const nextDependency = dependenciesToCheck.shift();
    const dependents = dependentsGraph.get(nextDependency);

    dependents.forEach(dependent => {
      if (!allDependents[dependent]) {
        allDependents[dependent] = {
          dependencies: dependencyGraph.get(dependent),
          dependents: dependentsGraph.get(dependent),
          name: dependent,
        };
        dependenciesToCheck.push(dependent);
      }
    });
  }
  return allDependents;
}

async function createChangeset(
  changedPackages /*: Array<string> */,
  opts /*: { cwd?: string }  */ = {},
) {
  const cwd = opts.cwd || process.cwd();
  const allPackages = await bolt.getWorkspaces({ cwd });
  const changeset /*: changesetType */ = {
    summary: '',
    releases: [],
    dependents: [],
  };

  let unchangedPackages = [];

  for (let pkg of allPackages) {
    if (!changedPackages.includes(pkg.name)) unchangedPackages.push(pkg.name);
  }

  const inquirerList = [
    new inquirer.Separator('changed packages'),
    ...changedPackages,
    new inquirer.Separator('unchanged packages'),
    ...unchangedPackages,
    new inquirer.Separator(),
  ];

  const packagesToRelease = await cli.askCheckbox(
    'Which packages would you like to include?',
    inquirerList,
  );
  /** Get released packages and bumptypes */

  for (const pkg of packagesToRelease) {
    const bumpType = await cli.askList(
      `What kind of change is this for ${chalk.green(pkg)}?`,
      ['patch', 'minor', 'major'],
    );
    changeset.releases.push({ name: pkg, type: bumpType });
  }

  /** Get summary for changeset */

  logger.log(
    'Please enter a summary for this change (this will be in the changelogs)',
  );
  const summary = await cli.askQuestion('Summary');

  /** Get dependents and bumptypes */

  const allDependents /*: dependents */ = await getAllDependents(
    packagesToRelease,
    { cwd },
  );

  const dependentsGraph = await bolt.getDependentsGraph({ cwd });
  const allWorkSpaces = await bolt.getWorkspaces({ cwd });

  // This modifies the above dependents array to add a 'type' property to all
  // items.
  await promptAndAssembleReleaseTypes(
    packagesToRelease,
    allDependents,
    changeset,
    allWorkSpaces,
  );

  // (TODO: Get releaseNotes if there is a major change)

  // NOTE: This path is not fully implemented yet. It should be revisited when
  // release notes are on the website
  // if (Object.values(changeset.releases).some(r => r.type === 'major')) {
  //   logger.log('You are making a breaking change, you\'ll need to create new release file to document this');
  //   logger.log('(you can set you $EDITOR variable to control which editor will be used)');
  //
  //   await cli.askConfirm('Create new release?'); // This is really just to let the user read the message above
  //   const newReleasePath = createReleaseNotesFile('new-release.md', summary); // hard-coding here, but we should prompt for it
  //   await cli.askEditor(newReleasePath);
  //   changeset.releaseNotes = newReleasePath;
  // }

  changeset.summary = summary;
  // as the changeset is printed to console, the finalised verified property needs
  // to be removed
  changeset.dependents = Object.keys(allDependents)
    .filter(
      depName =>
        allDependents[depName].type && allDependents[depName].type !== 'none',
    )
    .map(depName => {
      const { name, type, dependencies } = allDependents[depName];
      return {
        name,
        type,
      };
    });

  return changeset;
}

module.exports = createChangeset;
