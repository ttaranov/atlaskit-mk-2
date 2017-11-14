/* eslint-disable no-console */
// @flow

const chalk = require('chalk');
const bolt = require('bolt');

const cli = require('../../utils/cli');
const logger = require('../../utils/logger');
const createReleaseNotesFile = require('./createReleaseNotesFile');
const getDependencyType = require('./getDependencyType');

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
type bumpType = 'none' | 'patch' | 'minor' | 'major'
type releaseType = {
  name: string,
  type: string,
}
*/
/*::
type dependentType = {
  name: string,
  type?: string,
  dependencies: Array<string>,
  verified?: boolean
}
*/

function getRange (allWorkSpaces, dependent, nextDependency) {
  const pkg = allWorkSpaces.find((ws) => ws.name === dependent.name).config
  const DEPENDENCY_TYPES = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'bundledDependencies',
    'optionalDependencies'
  ];
  let allDependencies = new Map();

  for (let type of DEPENDENCY_TYPES) {
    let deps = pkg[type];
    if (!deps) continue;

    for (let name of Object.keys(deps)) {
      allDependencies.set(name, deps[name]);
    }
  }

  return allDependencies.get(nextDependency);
}

async function getAllDependents(packagesToRelease, opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const allDependents = [];
  const dependentsGraph = await bolt.getDependentsGraph({ cwd });

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

function getUpdateDetails (dependent, changeset, dependents, allWorkSpaces) {
  let unverified = false;
  let mustUpdateBecause = [];
  let mayUpdateBecause = [];

  dependent.dependencies.forEach(name => {
    const type = getDependencyType(allWorkSpaces, dependent, name)

    // there are three valid types:
    // - dependency has no release type yet and is unverified. It may cause a
      // release if this dependency gains a release type
    // - dependency has a release type that requires a release, as its semver
      // range requires an update to package.json of current package
    // - dependency does not require a release, based on package.json current verion

    let release = changeset.releases.find(rel => rel && rel.name === name);
    if (!release) release = dependents.find(dep => dep.name === name);
    if (!release) throw new Error(`Congratulations! You have made an impossible state!`)
    // case 1
    if (!release.type) {
      unverified = true;
      mayUpdateBecause = mayUpdateBecause.concat(name)
    // case 2
    } else if (type.mustUpdateOn.includes(release.type)) {
      mustUpdateBecause = mustUpdateBecause.concat(name);
    // case 3
    } else {
      mayUpdateBecause = mayUpdateBecause.concat(name);
    }
  })
  return { unverified, mustUpdateBecause, mayUpdateBecause }
}

async function getFirstTimeMessage (mustUpdateBecause, mayUpdateBecause, dependentName, updateOptions) {
  const mustUpdateList = chalk.green(mustUpdateBecause.join(', '));
  const mayUpdateList = chalk.green(mayUpdateBecause.join(', '));

  if (mustUpdateList) logger.log(`Bumping [${mustUpdateList}] will cause an update to ${dependentName}'s dependencies.`);
  if (mayUpdateList) logger.log(`Bumping [${mayUpdateList}] can cause an update to ${dependentName}'s dependencies.`);
  return await cli.askList(`What kind of change is this for ${dependentName}?`, updateOptions);
}

async function getFurtherTimeMessage (mustUpdateBecause, mayUpdateBecause, dependentName, updateOptions) {
  const mustUpdateList = chalk.green(mustUpdateBecause.join(', '));
  const mayUpdateList = chalk.green(mayUpdateBecause.join(', '));

  logger.log(`Due to other changes you have selected, you need to change the type of release for ${dependentName}`);
  if (mustUpdateList) logger.log(`Bumping [${mustUpdateList}] will cause an update to ${dependentName}'s dependencies.`);
  if (mayUpdateList) logger.log(`Bumping [${mustUpdateList}] can cause an update to ${dependentName}'s dependencies. If you are bumping any of these, you will need to bump ${dependentName}`);
  return await cli.askList(`What kind of change is this for ${dependentName}?`, updateOptions);
}

async function promptAndAssembletReleaseTypes (dependents, allWorkSpaces, changeset, messageFunc) {
  // We keep asking questions until everything is verified
  while (dependents.find(dependent => !dependent.verified)) {
    for (const dependent of dependents) {
      const {
        unverified, mustUpdateBecause, mayUpdateBecause
      } = getUpdateDetails(dependent, changeset, dependents, allWorkSpaces)
      // if dependent has a type, we have already asked about it, if it is now
      // verified, then we can verify it without asking about it again.
      if (dependent.type && !unverified && dependent.type !== 'none') {
        dependent.verified = true;
        return;
      }

      const updateOptions = mustUpdateBecause.length > 0
        ? ['patch', 'minor', 'major']
        : ['none', 'patch', 'minor', 'major']

      const dependentName = chalk.green(dependent.name);
      const bumpType/*: bumpType */ = dependent.type
      ? await getFurtherTimeMessage(mustUpdateBecause, mayUpdateBecause, dependentName, updateOptions)
      : await getFirstTimeMessage(mustUpdateBecause, mayUpdateBecause, dependentName, updateOptions)
      dependent.type = bumpType;
      // The only time we are concerned about re-checking are when 'none' is selected
      // and it was unverified
      dependent.verified = bumpType !== 'none' || !unverified
    }
  }
}

async function createChangeset(changedPackages/*: Array<string> */, opts/*: { cwd?: string }  */ = {}) {
  const cwd = opts.cwd || process.cwd();
  const allWorkSpaces = await bolt.getWorkspaces({ cwd })
  const changeset/*: {
    summary: string,
    releases: Array<releaseType>,
    dependents: Array<dependentType>,
    releaseNotes?: any,
  } */ = {
    summary: '',
    releases: [],
    dependents: [],
  };

  const packagesToRelease = await cli.askCheckbox(
    'Which packages would you like to include?',
    changedPackages,
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

  const dependents/*: Array<dependentType> */ = await getAllDependents(packagesToRelease, { cwd });

  // This modifies the above dependents array to add a 'type' property to all
  // items.
  await promptAndAssembletReleaseTypes(dependents, allWorkSpaces, changeset)

  /* (TODO: Get releaseNotes if there is a major change)

  if (Object.values(changeset.releases).some(bump => bump.type === 'major')) {
    logger.log('You are making a breaking change, you\'ll need to create new release file to document this');
    logger.log('(you can set you $EDITOR variable to control which editor will be used)');

    await cli.askConfirm('Create new release?'); // This is really just to let the user read the message above
    const newReleasePath = createReleaseNotesFile('new-release.md', summary); // hard-coding here, but we should prompt for it
    await cli.askEditor(newReleasePath);
    changeset.releaseNotes = newReleasePath;
  }
  */

  changeset.summary = summary;
  // as the changeset is printed to console, the unneeded verified property needs
  // to be removed
  changeset.dependents = dependents.map(d => {
    delete d.verified;
    return d
  });

  return changeset;
}

module.exports = createChangeset;
