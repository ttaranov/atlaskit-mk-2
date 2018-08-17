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
    // nextRelease is our dependency, think of it as "avatar"
    const nextRelease = toSearch.shift();
    const nextReleasePkg = allPackages.find(
      pkg => pkg.name === nextRelease.name,
    );
    const nextReleaseVersion = semver.inc(
      nextReleasePkg.config.version,
      nextRelease.type,
    );
    // dependents will be a list of packages that depend on nextRelease ie. ['avatar-group', 'comment']
    const dependents = dependencyGraph.get(nextRelease.name);

    dependents.forEach(dependent => {
      // For each dependent we are going to see whether it needs to be bumped because it's dependency
      // is leaving the version range.
      const dependentPkg = allPackages.find(pkg => pkg.name === dependent);
      const { depTypes, versionRange } = getDependencyVersionRange(
        dependentPkg.config,
        nextRelease.name,
      );
      // Firstly we check if it is a peerDependency because if it is, we can't do any early exits
      // and our dependent bump type needs to be major.
      if (
        depTypes.includes('peerDependencies') &&
        nextRelease.type !== 'patch'
      ) {
        // check if we have seen this dependent before (we will need to update rather than insert)
        let existing = changeset.dependents.find(dep => dep.name === dependent);
        if (existing) {
          // we can safely always override this as it's either going to be 'patch' or 'major' already
          existing.type = 'major';
        } else {
          changeset.dependents.push({
            name: dependent,
            type: 'major',
            dependencies: [],
          });
        }
        toSearch.push({ name: dependent, type: 'major' });
        // Exit early here, we don't want to execute the rest of the code
        return;
      }

      // we can exit early if we have seen this dependent before or we know we are going to look
      // at it later because that means it's already definitely being released
      if (changeset.dependents.some(dep => dep.name === dependent)) return;
      if (changeset.releases.some(dep => dep.name === dependent)) return;

      // Otherwise we check if the next version is going to leave our range
      if (!semver.satisfies(nextReleaseVersion, versionRange)) {
        // if so we add it to toSearch to see it's dependents and to the changeset
        toSearch.push({ name: dependent, type: 'patch' });
        changeset.dependents.push({
          name: dependent,
          type: 'patch',
          // we will fill this in at the end
          dependencies: [],
        });
      }
    });
  }

  // Now we need to fill in the dependencies arrays for each of the dependents. We couldn't accurately
  // do it until now because we didn't have the entire list of packages being released yet
  changeset.dependents.forEach(dependent => {
    const dependentPkg = allPackages.find(pkg => pkg.name === dependent.name);
    const dependencies = [...changeset.dependents, ...changeset.releases]
      .map(pkg => pkg.name)
      .filter(
        dep =>
          !!getDependencyVersionRange(dependentPkg.config, dep).versionRange,
      );

    dependent.dependencies = dependencies;
  });

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

/*
  Returns an object in the shape { depTypes: [], versionRange: '' } with a list of different depTypes
  matched ('dependencies', 'peerDependencies', etc) and the versionRange itself ('^1.0.0')
*/

function getDependencyVersionRange(dependentPkgJSON, dependencyName) {
  const DEPENDENCY_TYPES = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'bundledDependencies',
    'optionalDependencies',
  ];
  const dependencyVersionRange = {
    depTypes: [],
    versionRange: '',
  };
  for (let type of DEPENDENCY_TYPES) {
    let deps = dependentPkgJSON[type];
    if (!deps) continue;
    if (deps[dependencyName]) {
      dependencyVersionRange.depTypes.push(type);
      // We'll just override this each time, *hypothetically* it *should* be the same...
      dependencyVersionRange.versionRange = deps[dependencyName];
    }
  }
  return dependencyVersionRange;
}

module.exports = createChangeset;
