const createReleaseObject = require('./createReleaseObject');

/** Publish commit message format

    RELEASING: Releasing 1 package and 1 dependent

    Versions:
      [d9655fe] - Summary for Version commit d9655fe
      [3ca060d] - Another summary for a different Version commit

    Releases:
      @atlaskit/build-utils@1.0.0

    Dependents:
      @atlaskit/releases@1.1.1 bumping dependency on @atlaskit/build-utils
 *
 */

const flattenDependents = foo => ([{
  dependent: 'dependent',
  version: 'version',
  dependency: 'dependency',
}]);

// Versions is an array of Version objects in the same form as we use in createVersionCommitStr
// except it also has the commit hash from when the version was commited
function createPublishCommitStr(versions) {
  const releasedPackages = createReleaseObject(versions);
  const dependents = flattenDependents(versions);

  const releaseLines = releasedPackages.map(release => `  ${release.name}@${release.version}`);
  const dependentsLines = dependents.map(dep => `  ${dep.dependent}@${dep.version} bumping dependency on ${dep.dependency}`);
  const versionLines = versions.map(version => `  [${version.commit}] - ${version.summary}`);

  return `RELEASING: Releasing ${releasedPackages.length} package and ${dependents.length} dependent(s)

Versions:
${versionLines.join('\n')}

Releases:
${releaseLines.join('\n')}

Dependents:
${dependentsLines.join('\n')}
`;
}

module.exports = createPublishCommitStr;
