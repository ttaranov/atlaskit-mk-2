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

function generateMarkdownTemplate(release, releaseObject, repoUrl) {
  const { changesets, releases } = releaseObject;
  const result = [`## ${release.version}`];

  let relatedChangesets = [];
  for (let commitHash of release.commits) {
    if (!relatedChangesets.find(c => c.commit === commitHash)) {
      relatedChangesets.push(changesets.find(c => c.commit === commitHash));
    }
  }

  const releaseLines = relatedChangesets
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

  /**
   *  Create the dependency bumping section. We'll create one "entry" per changeset that lists us
   *  as a dependent, and include all the dependencies we are bumping with their new versions
   */
  relatedChangesets.forEach(changeset => {
    // check if this changeset lists us as a dependent
    const dependent = changeset.dependents.find(
      dep => dep.name === release.name,
    );
    if (!dependent) return;

    const lines = [];
    lines.push(
      `- [${dependent.type}] Updated dependencies ${commitLink(
        changeset.commit,
        repoUrl,
      )}`,
    );

    dependent.dependencies.forEach(depName => {
      // check if we are releasing this dependency (ignore if not)
      const dependencyRelease = releases.find(r => r.name === depName);
      if (!dependencyRelease) return;
      const version = dependencyRelease.version;
      lines.push(`  - ${depName}@${version}`);
    });

    if (lines.length > 0) {
      result.push(lines.join('\n'));
    }
  });

  return result.filter(line => line).join('\n');
}

module.exports = {
  generateMarkdownTemplate,
};
