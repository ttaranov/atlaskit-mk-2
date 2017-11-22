/**
 * @param {string} summary - release title
 * @param {string} versionType - [major, minor, patch]
 * @param {string} doc - path to release doc
 */
function releaseLine(summary, versionType, doc, commit, repoUrl) {
  const result = [];
  result.push(`- [${versionType}] ${summary} ${commitLink(commit, repoUrl)}`);
  if (doc) {
    result.push(`  - See [${doc}](${doc}) for more information`);
  }
  return result.join('\n');
}

function commitLink(commit, repoUrl) {
  return repoUrl
    ? `[${commit}](${repoUrl}/${commit})`
    : `[${commit}](${commit})`;
}

function generateMarkdownTemplate(
  release,
  releaseObject,
  updatedDeps,
  repoUrl,
) {
  const { changesets, releases } = releaseObject;
  const result = [`## ${release.version}`];

  const releatedChangesets = release.commits.map(commitHash =>
    changesets.find(c => c.commit === commitHash),
  );

  const releaseLines = releatedChangesets
    .map(changeset => {
      const changesetRelease = changeset.releases.find(
        r => r.name === release.name,
      );
      const commitSegment = commitLink(changeset.commit, repoUrl);
      if (!changesetRelease) {
        // We don't find a release for this package in current changeset
        // It's possible been released as a dependency update
        return '';
      }
      return releaseLine(
        changeset.summary,
        changesetRelease.type,
        changeset.releaseNotes,
        changeset.commit,
        repoUrl,
      ).trim('\n');
    })
    .join('\n');
  result.push(releaseLines);

  if (updatedDeps.length > 0) {
    const updatedDepsLine = `- Updated Dependencies: ${updatedDeps
      .map(dep => `${dep.name} (${dep.version})`)
      .join(', ')}`;
    result.push(updatedDepsLine);
  }
  return result.filter(line => line).join('\n');
}

module.exports = {
  generateMarkdownTemplate,
};
