/**
 * @param {string} summary - release title
 * @param {string} versionType - [major, minor, patch]
 * @param {string} doc - path to release doc
 */
function releaseLine(summary, versionType, doc, commit) {
  const result = [];
  result.push(`- [${versionType}] ${summary} [${commit}](${commit})`);
  if (doc) {
    result.push(`  - See [${doc}](${doc}) for more information`);
  }
  return result.join('\n');
}

function commitLink(commit) {
  return `[${commit}](${commit})`;
}

function generateMarkdownTemplate(pkg, releaseObject) {
  const { changeSets, releases } = releaseObject;
  const result = [`## ${pkg.version}`];

  const releatedChangeSets = pkg.commits.map(commitHash => changeSets.find(c => c.commit === commitHash));

  const releaseLines = releatedChangeSets.map((changeSet) => {
    const release = changeSet.releases.find(r => r.name === pkg.name);
    if (!release) {
      // We don't find a release for this package in current changeSet
      // It's possible been released as a dependency update
      return '';
    }
    return releaseLine(
      changeSet.summary,
      release.type,
      changeSet.releaseNotes,
      changeSet.commit
    ).trim('\n');
  }).join('\n');
  result.push(releaseLines);

  if (Array.isArray(pkg.dependencies) && pkg.dependencies.length > 0) {
    const dependencyLines = releatedChangeSets.map((changeSet) => {
      const dep = changeSet.dependents.find(d => d.name === pkg.name);
      const lines = [];
      lines.push(`- [${dep.type}] Updated dependencies ${commitLink(changeSet.commit)}`);
      dep.dependencies.forEach(name => {
        const version = releases.find(r => r.name === name).version;
        lines.push(`  - ${name}@${version}`);
      });
      return lines.join('\n');
    });
    result.push(dependencyLines);
  }
  return result.filter(line => line).join('\n');
}

module.exports = {
  generateMarkdownTemplate,
};
