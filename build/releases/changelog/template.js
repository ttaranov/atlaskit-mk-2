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

function commitLinks(commits) {
  return commits.map(cm => `[${cm}](${cm})`).join(', ');
}

function dependencyLines(dependent) {
  const result = ['- [dependencies] Updated dependencies'];
  const dependencies = dependent.dependencies.map((dep) =>
    `  - ${dep.name}@${dep.version} ${commitLinks(dep.commits)}`
  );
  return result.concat(dependencies).join('\n');
}

/**
 * @param {Object} pkg
 * @param {string} pkg.name
 * @param {string} pkg.version - [major, minor, patch]
 * @param {Object[]} pkg.changeSets
 * @param {string} pkg.changeSets[].summary
 * @param {string} pkg.changeSets[].commit
 * @param {Object} pkg.changeSets[].releases
 * @param {Object} pkg.dependent
 * @param {string} pkg.dependent.version
 * @param {Object[]} pkg.dependent.dependencies
 * @param {string} pkg.dependent.dependencies[].name
 * @param {string} pkg.dependent.dependencies[].version
 * @param {string[]} pkg.dependent.dependencies[].commits
 */
function generateMarkdownTemplate(pkg) {
  const result = [`## ${pkg.version}`];
  const releaseLines = pkg.changeSets.map((changeSet) =>
    releaseLine(
      changeSet.summary,
      changeSet.releases[pkg.name],
      changeSet.doc,
      changeSet.commit
    ).trim('\n')
  ).join('\n');
  result.push(releaseLines);

  if (pkg.dependent) {
    result.push(dependencyLines(pkg.dependent));
  }

  return result.join('\n');
}

module.exports = {
  generateMarkdownTemplate,
};
