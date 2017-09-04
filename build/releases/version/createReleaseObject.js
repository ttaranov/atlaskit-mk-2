const semver = require('semver');

/*
  This flattens an array of Version objects into one object that can be used to create the changelogs
  and the publish commit messages.

  It's output will look like

  {
    releases: [{                  // packages being released because of actual code changes
      name: 'package-a',
      version: '1.1.0',           // actual version being released
      changesets: [<Changeset>, ] // filtered to ones for this package (used in changelogs)
    }]
    dependents: [{                // packages that are being released because of deps changing
      dependent: 'package-b',
      version: '1.0.1',
      dependencies: [
        { name: 'package-a', version: '1.0.1', commits: ['d0a7ec0', 'ce21c8f'] },
        { name: 'package-c', version: '1.0.1', commits: ['d0a7ec0', 'ce21c8f'] }
      ],
    }],
    changesets: [<Changeset>] // References to all the changesets used to build Release
                              // Used only for the summaries in publish commits
  }
*/

// Hardcoding this function for now
function getCurrentVersion(packageName) {
  return '1.0.0';
}

// returns which bump type is bigger (bumpA can be undefined)
function maxBumpType(bumpA, bumpB) {
  if (bumpA === 'major' || bumpB === 'major') return 'major';
  if (bumpA === 'minor' || bumpB === 'minor') return 'minor';
  return 'patch';
}

/*

  flattenReleases
    getRelevantChangesets
    getMaxBumpType
    getFinalVersion

  flattenDependents
    getRelevantChangset
    getFinalVersion (check releases as well)
    flattenAllDependencies
      getFinalVersion
      getRelevantCommits
*/

// Takes a Changeset object and returns an array of releaseInfo objects for each release it contains
// i.e [ {name: 'foo', type: 'bump', changeset: {} } ] < -changeset is a reference to the original changeset
function flattenSingleChangeset(changeset) {
  const flattened = [];

  Object.entries(changeset.releases).forEach(([name, type]) => {
    flattened.push({ name, type, changeset });
  });

  return flattened;
}

// Takes an array of releaseInfo objects and reduces them so that there is only one entry per package
// and that only the highest bumptype remains (and all commits are stored)
function flattenReleaseArray(releases) {
  const flattened = [];

  releases.forEach(release => {
    const { name, type, changeset } = release;
    const foundBefore = flattened.find(pkg => pkg.name === name);
    if (!foundBefore) {
      flattened.push({ name, type, changesets: [changeset] });
    } else {
      foundBefore.type = maxBumpType(foundBefore.type, type);
      foundBefore.changesets.push(changeset);
    }
  });

  return flattened;
}

// creates the 'releases' object for a Release by resolving maximum bump type and final version
function flattenReleases(changesets) {
  const releases = changesets.map(changeset => flattenSingleChangeset(changeset))
    // reduce to a single array of release information by concatenating
    .reduce((cur, next) => cur.concat(next));

  return flattenReleaseArray(releases);
}

/** Takes an array of Changeset and returns an array of dependentsInfo in the form
// [
  {
    name: 'foo',                          // name of the dependent package
    dependencies: [
      name: 'bar',                        // name of dependency
      commits: ['0e483e9', '83962c4']     // array of commits where this dependency was updated
    ]
  }
] */
function flattenDependents(changesets) {
  const flattened = [];

  changesets.forEach(changeset => {
    Object.entries(changeset.dependents).forEach(([dependent, dependencies]) => {
      const foundDependentBefore = flattened.find(pkg => pkg.name === dependent);
      if (!foundDependentBefore) {
        flattened.push({
          name: dependent,
          dependencies: dependencies.map(dep => ({ name: dep, commits: [changeset.commit] })),
        });
      } else {
        dependencies.forEach(dep => {
          const foundDependencyBefore = foundDependentBefore.dependencies.find(pkg => pkg.name === dep);
          if (!foundDependencyBefore) {
            foundDependentBefore.dependencies.push({ name: dep, commits: [changeset.commit] });
          } else {
            foundDependencyBefore.commits.push(changeset.commit);
          }
        });
      }
    });
  });

  return flattened;
}

function createReleaseObject(changesets) {
  const flattenedReleases = flattenReleases(changesets);
  const flattenedDependents = flattenDependents(changesets);
  return {
    releases: flattenedReleases,
    dependents: flattenedDependents,
    changesets,
  };
}

module.exports = createReleaseObject;
