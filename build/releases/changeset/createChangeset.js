/* eslint-disable no-console */
// @flow

const { green, yellow, red } = require('chalk');
const bolt = require('bolt');

const cli = require('../../utils/cli');
const logger = require('../../utils/logger');
const createReleaseNotesFile = require('./createReleaseNotesFile');
const inquirer = require('inquirer');
const semver = require('semver');
const outdent = require('outdent');

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
}
type changesetDependentType = {
  name: string,
  dependencies: Array<string>,
  type?: string,
}
type changesetType = {
  summary: string,
  releases: Array<releaseType>,
  dependents: Array<changesetDependentType>,
  releaseNotes?: any,
}
*/

async function getPackageBumpRange(pkgJSON) {
  let { name, version, maintainers } = pkgJSON;
  // Get the version range for a package someone has chosen to release
  let type = await cli.askList(
    `What kind of change is this for ${green(
      name,
    )}? (current version is ${version})`,
    ['patch', 'minor', 'major'],
  );

  // for packages that are under v1, we want to make sure major releases are intended,
  // as some repo-wide sweeping changes have mistakenly release first majors
  // of packages.
  if (type === 'major' && semver.lt(version, '1.0.0')) {
    let maintainersString = '';

    if (maintainers && Array.isArray(maintainers) && maintainers.length > 0) {
      maintainersString = ` (${maintainers.join(', ')})`;
    }
    // prettier-ignore
    const message = yellow(outdent`
      WARNING: Releasing a major version for ${green(name)} will be its ${red('first major release')}.
      If you are unsure if this is correct, contact the package's maintainers${maintainersString} ${red('before committing this changeset')}.

      If you still want to release this package, select the appropriate version below:
    `)
    // prettier-ignore-end
    type = await cli.askList(message, ['patch', 'minor', 'major']);
  }

  return type;
}

async function createChangeset(
  changedPackages /*: Array<string> */,
  opts /*: { cwd?: string }  */ = {},
) {
  const cwd = opts.cwd || process.cwd();
  const allPackages = await bolt.getWorkspaces({ cwd });
  const dependencyGraph = await bolt.getDependentsGraph({ cwd });

  const changeset /*: changesetType */ = {
    summary: '',
    releases: [],
    dependents: [],
  };

  let packagesToRelease = await getPackagesToRelease(
    changedPackages,
    allPackages,
  );

  for (const pkg of packagesToRelease) {
    const pkgJSON = allPackages.find(({ name }) => name === pkg).config;

    const type = await getPackageBumpRange(pkgJSON);

    changeset.releases.push({ name: pkg, type });
  }

  logger.log(
    'Please enter a summary for this change (this will be in the changelogs)',
  );

  changeset.summary = await cli.askQuestion('Summary');

  const toSearch = [...changeset.releases];

  while (toSearch.length > 0) {
    // search...
    const nextRelease = toSearch.shift();
    const nextReleasePkg = allPackages.find(
      pkg => pkg.name === nextRelease.name,
    );
    const nextReleaseVersion = semver.inc(
      nextReleasePkg.config.version,
      nextRelease.type,
    );

    const dependents = dependencyGraph.get(nextRelease.name);
    dependents.forEach(dependent => {
      if (changeset.dependents.some(dep => dep.name === dependent)) return;
      if (changeset.releases.some(dep => dep.name === dependent)) return;

      const dependentPkg = allPackages.find(pkg => pkg.name === dependent);

      const dependencyRange = getDependencyVersionRange(
        dependentPkg.config,
        nextRelease.name,
      );

      if (!dependencyRange)
        throw new Error(
          `We have entered an impossible state where ${
            nextRelease.name
          } is depended upon by ${dependent}, but at no version.`,
        );

      if (!semver.satisfies(nextReleaseVersion, dependencyRange)) {
        if (changeset.dependents.includes(dep => dep.name === dependent))
          return;

        toSearch.push({
          name: dependent,
          type: 'patch',
        });
        const dependencies = packagesToRelease.filter(
          dep => !!getDependencyVersionRange(dependentPkg.config, dep),
        );

        changeset.dependents.push({
          name: dependent,
          type: 'patch',
          dependencies,
        });
      }
    });
  }

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

  return changeset;
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

async function getPackagesToRelease(changedPackages, allPackages) {
  function askInitialReleaseQuestion(defaultInquirerList) {
    return cli.askCheckboxPlus(
      // TODO: Make this wording better
      // TODO: take objects and be fancy with matching
      'Which packages would you like to include?',
      defaultInquirerList,
    );
  }

  let unchangedPackagesNames = allPackages
    .map(({ name }) => name)
    .filter(name => !changedPackages.includes(name));

  const defaultInquirerList = [
    new inquirer.Separator('changed packages'),
    ...changedPackages,
    new inquirer.Separator('unchanged packages'),
    ...unchangedPackagesNames,
    new inquirer.Separator(),
  ];

  let packagesToRelease = await askInitialReleaseQuestion(defaultInquirerList);

  if (packagesToRelease.length === 0) {
    do {
      logger.error('You must select at least one package to release');
      logger.error('(You most likely hit enter instead of space!)');

      packagesToRelease = await askInitialReleaseQuestion(defaultInquirerList);
    } while (packagesToRelease.length === 0);
  }
  return packagesToRelease;
}

function getDependencyVersionRange(dependentPkgJSON, dependencyName) {
  const DEPENDENCY_TYPES = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'bundledDependencies',
    'optionalDependencies',
  ];
  for (let type of DEPENDENCY_TYPES) {
    let deps = dependentPkgJSON[type];
    if (!deps) continue;
    if (deps[dependencyName]) {
      return deps[dependencyName];
    }
  }
  return null;
}

module.exports = createChangeset;
