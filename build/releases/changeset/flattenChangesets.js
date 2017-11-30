// returns which bump type is bigger (bumpA can be undefined)
function maxBumpType(bumpA, bumpB) {
  if (bumpA === 'major' || bumpB === 'major') return 'major';
  if (bumpA === 'minor' || bumpB === 'minor') return 'minor';
  if (bumpA === 'patch' || bumpB === 'patch') return 'patch';
  return 'none';
}

// Takes an array of Changesets and returns a flat list of actual releases with only one entry per
// package. i.e [{ name:'', type:'', commits: ['', ''], dependencies: []}, ]
function flattenReleases(changesets) {
  const flattened = [];
  const combined = [];

  changesets.forEach(changeset => {
    changeset.releases.forEach(release => {
      combined.push({
        name: release.name,
        type: release.type,
        commit: changeset.commit,
      });
    });

    changeset.dependents.forEach(dependent => {
      combined.push({
        name: dependent.name,
        type: dependent.type,
        commit: changeset.commit,
      });
    });
  });

  combined.forEach(release => {
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

module.exports = flattenReleases;
