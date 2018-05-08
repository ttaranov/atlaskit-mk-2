// @flow
const chalk = require('chalk');
const bolt = require('bolt');

const cli = require('../../utils/cli');
const logger = require('../../utils/logger');
const getMustUpdateOn = require('./getMustUpdateOn');
const inquirer = require('inquirer');

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
  dependencies: Array<string>,
}
type changesetType = {
  summary: string,
  releases: Array<releaseType>,
  dependents: Array<changesetDependentType>,
  releaseNotes?: any,
}
*/

function leftPad(indent, msg) {
  return Array(indent + 1).join(' ') + msg;
}
function indentLog(indent, msg) {
  logger.log(leftPad(indent, msg));
}

function leftPadOptions(indent, options) {
  return options.map(o => ({
    name: leftPad(indent, o),
    value: o,
    short: o,
  }));
}

function getUpdateDetails(dependent, changeset, allDependents, allWorkSpaces) {
  // a dependent is finalised when all of its dependencies have a release type.
  let allDependentsFinalised = true;
  let mustUpdateBecause = [];
  let mayUpdateBecause = [];

  dependent.dependencies.forEach(name => {
    const dependencyType = getMustUpdateOn(allWorkSpaces, dependent, name);

    // there are three possible states for a dependent's update:
    // - a dependency has no release type yet and dependent is not allDependentsFinalised. It may
    // cause a release if this dependency gains a release type
    // - dependency has a release type that requires a release, as its semver
    // range requires an update to package.json of current package
    // - dependency does not require a release, based on package.json current verion

    let release = changeset.releases.find(rel => rel && rel.name === name);
    if (!release) release = allDependents.find(dep => dep.name === name);
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
  dependent,
  updateOptions,
  isSubsequent,
  level,
}) {
  const dependentName = chalk.green(dependent.name);
  const mustUpdateList = chalk.green(mustUpdateBecause.join(', '));
  const mayUpdateList = chalk.green(mayUpdateBecause.join(', '));

  const indent = level * 4;
  // const indent = 0;

  if (isSubsequent && mustUpdateList) {
    indentLog(
      indent,
      `Due to other changes you have selected, you need to change the type of release for ${dependentName}`,
    );
  }
  if (mustUpdateList) {
    indentLog(
      indent,
      `Bumping [${mustUpdateList}] will cause an update to ${dependentName}'s dependencies.`,
    );
  } else if (mayUpdateList) {
    indentLog(
      indent,
      `Bumping [${mayUpdateList}] can cause an update to ${dependentName}'s dependencies.`,
    );
  }
  return await cli.askList(
    leftPad(indent, `What kind of change is this for ${dependentName}?`),
    updateOptions.map(o => ({
      name: leftPad(indent, o),
      value: o,
      short: o,
    })),
    updateOptions,
  );
}

async function promptAndAssembleDependentReleaseTypes(
  packageNames /*: string[] */,
  allDependents /*: dependents */,
  changeset /*: changesetType */,
  allWorkSpaces /*: any */,
  level /*: number */,
) {
  const packages = packageNames.map(name => allDependents[name]);

  for (let pkg of packages) {
    if (pkg.type === 'none') {
      /* Don't ask about dependents of pkg if we are not updating it. */
      continue;
    }

    const partitionedDeps = pkg.dependents.reduce(
      (acc, depName) => {
        const dep = allDependents[depName];
        const mustUpdateParams = getMustUpdateOn(allWorkSpaces, dep, pkg.name);
        const mustUpdate = mustUpdateParams.mustUpdateOn.includes(pkg.type);

        if (changeset.releases.find(r => r.name === depName)) {
          acc.released.push(depName);
        } else if (mustUpdate) {
          acc.mustUpdate.push(depName);
        } else {
          acc.mayUpdate.push(depName);
        }

        return acc;
      },
      { released: [], mustUpdate: [], mayUpdate: [] },
    );

    const indent = level * 4;
    const depsToUpdate = await cli.askCheckbox(
      leftPad(
        indent,
        `Which dependents of ${pkg.name} would you like to bump?`,
      ),
      [
        new inquirer.Separator(leftPad(indent, 'Released packages')),
        ...leftPadOptions(indent, partitionedDeps.released),
        new inquirer.Separator(leftPad(indent, 'Packages that must update')),
        ...leftPadOptions(indent, partitionedDeps.mustUpdate),
        new inquirer.Separator(leftPad(indent, 'Packages that may update')),
        ...leftPadOptions(indent, partitionedDeps.mayUpdate),
      ],
      { pageSize: 15 },
    );

    for (let depName of pkg.dependents) {
      const dependent = allDependents[depName];
      if (!dependent) {
        throw new Error(`Dependent '${depName}' not found in allDependents`);
      }

      const mustUpdate = partitionedDeps.mustUpdate.includes(depName);
      if (!(mustUpdate || depsToUpdate.includes(depName))) {
        /* Only show a prompt if the dep must update or the user has selected it. */
        continue;
      }

      const dependentName = chalk.green(dependent.name);
      const bumpType = await promptBumptype({
        mustUpdateBecause: mustUpdate ? [pkg.name] : [],
        mayUpdateBecause: [pkg.name],
        dependent,
        updateOptions: ['patch', 'minor', 'major'],
        isSubsequent: !!dependent.type,
        level,
      });
      dependent.type = bumpType;
      if (dependent.type !== 'none') {
        dependent.finalised = true;
        await promptAndAssembleDependentReleaseTypes(
          [dependent.name],
          allDependents,
          changeset,
          allWorkSpaces,
          level + 1,
        );
      }
    }
  }
}

async function promptAndAssembleReleaseTypes(
  packagesToRelease /*: string[] */,
  allDependents /*: dependents */,
  changeset /*: changesetType */,
  allWorkSpaces /*: any */,
) {
  // Add type prop to all packages being released
  packagesToRelease.forEach(pkgName => {
    const pkgChangeset = changeset.releases.find(r => r.name === pkgName);
    if (!pkgChangeset) {
      throw new Error(`Cannot find changeset for '${pkgName}'`);
    }
    allDependents[pkgName].type = pkgChangeset.type;
  });

  await promptAndAssembleDependentReleaseTypes(
    packagesToRelease,
    allDependents,
    changeset,
    allWorkSpaces,
    0,
  );
}

module.exports = promptAndAssembleReleaseTypes;
