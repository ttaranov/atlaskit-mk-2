const semver = require('semver');

/*
  This flattens an array of Version objects into one object that can be used to create the changelogs
  and the publish commit messages.

  Dependents will be calculated and added to releases, then final versions will be calculated.

  It's output will look like

  {
    releases: [{
      name: 'package-a',
      version: '1.1.0',               // actual version being released
      commits: ['fc4229d', 'aeb543f'] // filtered to ones for this package
                                      // (used in changelogs)
    },
    {
      name: 'package-b'
      version: '1.0.1',
      dependencies: ['package-a']     // release can include a list of dependencies
                                      // that were bumped
      commits: ['fc4229d', 'aeb543f'] // these would be the commits that caused bumps
    }]

    changesets: [<Changeset>] // References to all the changesets used to build Release
                              // to be able to look up summary and release notes
                              // information when building changelogs
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

// Takes a Changeset object and returns an array of releaseInfo objects for each release it contains
// i.e [ {name: 'foo', type: 'bump', commit: 'd7964f4' } ]
function flattenSingleChangeset(changeset) {
  const flattened = [];

  Object.entries(changeset.releases).forEach(([name, type]) => {
    flattened.push({ name, type, commit: changeset.commit });
  });

  return flattened;
}

// Takes an array of Changesets and returns a flat list of actual releases with only one entry per
// package. i.e [{ name:'', type:'', commits: ['', '']}, ]
function flattenReleases(changesets) {
  const flattened = [];
  // split each changeset into muliple releases with only the relevant info
  const releases = changesets.map(changeset => flattenSingleChangeset(changeset))
    // reduce to a single array of release information by concatenating
    .reduce((cur, next) => cur.concat(next));

  // now flatten the releases so we only have one entry per package
  releases.forEach(release => {
    const { name, type, commit } = release;
    const foundBefore = flattened.find(pkg => pkg.name === name);
    if (!foundBefore) {
      flattened.push({ name, type, commits: [commit] });
    } else {
      foundBefore.type = maxBumpType(foundBefore.type, type);
      foundBefore.commits.push(commit);
    }
  });

  return flattened;
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
  // THIS WILL BE REFACTORED ONCE WE START PULLING DEPENDENTS
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

function createRelease(changesets) {
  // First, combine all the changeset.releases into one useful array
  const flattenedReleases = flattenReleases(changesets);

  // Then add in the dependents to the releases
  // const allReleases = addDependentReleases(flattenedReleases)
  const allReleases = flattenedReleases
    // get the current version for each package
    .map(release => ({ ...release, version: getCurrentVersion(release.name) }))
    // update to new version for each package
    .map(release => ({ ...release, version: semver.inc(release.version, release.type) }))
    // stip out type field
    .map(({ type, ...rest }) => rest);

  return {
    releases: allReleases,
    changesets,
  };
}

module.exports = createRelease;
