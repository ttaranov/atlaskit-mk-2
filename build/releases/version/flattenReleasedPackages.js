const semver = require('semver');

/*
  Takes an array of Version objects and returns an array of objects with the actual versions that will
  be released
  i.e flattenReleasedPackages([
    { releases: { 'package-a': 'patch', 'package-b': 'major' }},
    { releases: { 'package-a': 'minor' }}
  ]);
  would return
  [{ name: 'package-a', version: '1.1.0' }, { name: 'package-b', version: '2.0.0' }, ]
*/
function flattenReleasedPackages(versions) {
  // hard code this for now, pull from pyarn(?) later
  const getCurrentVersion = pkgName => '1.0.0';
  // returns which bump type is bigger (bumpA can be undefined)
  const maxBumpType = (bumpA, bumpB) => {
    if (bumpA === 'major' || bumpB === 'major') return 'major';
    if (bumpA === 'minor' || bumpB === 'minor') return 'minor';
    return 'patch';
  };

  // for each release, find the highest bump type amonst all Versions
  const combinedVersions = {};
  versions.forEach(ver => {
    Object.keys(ver.releases).forEach(name => {
      combinedVersions[name] = maxBumpType(combinedVersions[name], ver.releases[name]);
    });
  });

  // flatten the results into an array {a: 1, b: 2} => [{ name: 'a', version: 1}, { name: 'b', version: 2}]
  // transform into an array
  const flattened = Object.keys(combinedVersions)
    .map(name => ({ name, version: combinedVersions[name] }));

  // now map bump types to actual versions for each package
  flattened.forEach(release => {
    const curVersion = getCurrentVersion(release.name);
    const newVersion = semver.inc(curVersion, release.version);
    release.version = newVersion;
  });

  return flattened;
}

module.exports = flattenReleasedPackages;
