// @flow
const chalk = require('chalk');
const bolt = require('bolt');

const cli = require('../../utils/cli');
const logger = require('../../utils/logger');
const getMustUpdateOn = require('./getMustUpdateOn');

/*::
type bumpType = 'none' | 'patch' | 'minor' | 'major'
type releaseType = {
  name: string,
  type: string,
}
type dependentType = {
  name: string,
  type?: string,
  dependencies: Array<string>,
  finalised?: boolean
}
type changesetDependentType = {
  name: string,
  type?: string,
  dependencies: Array<string>,
}
type changesetType = {
  summary: string,
  releases: Array<releaseType>,
  dependents: Array<changesetDependentType>,
  releaseNotes?: any,
}
*/

function getUpdateDetails(dependent, changeset, dependents, allWorkSpaces) {
  // a dependent is finalised when all of its dependencies have a release type.
  let allDependentsFinalised = true;
  let mustUpdateBecause = [];
  let mayUpdateBecause = [];

  dependent.dependencies.forEach(name => {
    const dependencyType = getMustUpdateOn(allWorkSpaces, dependent, name);

    // there are three possible states for an dependent's update:
    // - a dependency has no release type yet and dependent is not allDependentsFinalised. It may
    // cause a release if this dependency gains a release type
    // - dependency has a release type that requires a release, as its semver
    // range requires an update to package.json of current package
    // - dependency does not require a release, based on package.json current verion

    let release = changeset.releases.find(rel => rel && rel.name === name);
    if (!release) release = dependents.find(dep => dep.name === name);
    if (!release)
      throw new Error(`Congratulations! You have made an impossible state!`);
    // case 1
    if (!release.type) {
      allDependentsFinalised = false;
      mayUpdateBecause = mayUpdateBecause.concat(name);
      // case 2
    } else if (dependencyType.mustUpdateOn.includes(release.type)) {
      mustUpdateBecause = mustUpdateBecause.concat(name);
      // case 3
    } else {
      mayUpdateBecause = mayUpdateBecause.concat(name);
    }
  });
  // It should only be possible to skip prompts when the type is none. After that
  //
  const skipPrompt =
    dependent.type === 'none' &&
    allDependentsFinalised &&
    mustUpdateBecause.length === 0;
  return {
    allDependentsFinalised,
    mustUpdateBecause,
    mayUpdateBecause,
    skipPrompt,
  };
}

async function promptBumptype({
  mustUpdateBecause,
  mayUpdateBecause,
  dependentName,
  updateOptions,
  isSubsequent,
}) {
  const mustUpdateList = chalk.green(mustUpdateBecause.join(', '));
  const mayUpdateList = chalk.green(mayUpdateBecause.join(', '));

  if (isSubsequent)
    logger.log(
      `Due to other changes you have selected, you need to change the type of release for ${dependentName}`,
    );
  if (mustUpdateList)
    logger.log(
      `Bumping [${mustUpdateList}] will cause an update to ${dependentName}'s dependencies.`,
    );
  if (mayUpdateList)
    logger.log(
      `Bumping [${mayUpdateList}] can cause an update to ${dependentName}'s dependencies.`,
    );
  return await cli.askList(
    `What kind of change is this for ${dependentName}?`,
    updateOptions,
  );
}

async function promptAndAssembleReleaseTypes(
  dependents /*: Array<dependentType> */,
  changeset /*: changesetType */,
  cwd /*: string */,
) {
  const allWorkSpaces = await bolt.getWorkspaces({ cwd });

  // We keep asking questions until everything is finalised
  while (dependents.find(dependent => !dependent.finalised)) {
    for (const dependent of dependents) {
      const {
        allDependentsFinalised,
        mustUpdateBecause,
        mayUpdateBecause,
        skipPrompt,
      } = getUpdateDetails(dependent, changeset, dependents, allWorkSpaces);
      // if dependent has a type, we have already asked about it, if it is now
      // finalised, then we can verify it without asking about it again.
      if (dependent.finalised || skipPrompt) {
        dependent.finalised = true;
        continue;
      }
      const updateOptions =
        mustUpdateBecause.length > 0
          ? ['patch', 'minor', 'major']
          : ['none', 'patch', 'minor', 'major'];

      const dependentName = chalk.green(dependent.name);
      const bumpType /*: bumpType */ = await promptBumptype({
        mustUpdateBecause,
        mayUpdateBecause,
        dependentName,
        updateOptions,
        isSubsequent: !!dependent.type,
      });
      dependent.type = bumpType;
      // The only time we are concerned about re-checking are when 'none' is selected
      // and it was unfinalised
      dependent.finalised = bumpType !== 'none' || allDependentsFinalised;
    }
  }
}

module.exports = promptAndAssembleReleaseTypes;
