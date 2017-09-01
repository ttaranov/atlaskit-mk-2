/**
 * @param {string} summary - release title
 * @param {string} versionType - [major, minor, patch]
 * @param {string} doc - path to release doc
 */
function releaseLine(summary, versionType, doc) {
  const result = [];
  result.push(`- [${versionType}] ${summary}`);
  if (doc) {
    result.push(`  - See [${doc}](${doc}) for more information`);
  }
  return result.join('\n');
}

/**
 * @param {Object} pkg
 * @param {string} pkg.version - [major, minor, patch]
 * @param {Object[]} pkg.summaries
 * @param {string} pkg.summaries[].message
 * @param {string[]} pkg.summaries[].commits
 * @param {string} pkg.summaries[].version
 * @param {string} pkg.summaries[].doc
 * @param {Object[]} pkg.commits
 * @param {string} pkg.commits[].message
 * @param {string} pkg.commits[].hash
 * @param {string} pkg.commits[].version
 */
function generateMarkdownTemplate(pkg) {
  const releaseLines = pkg.releases.map((release) =>
    releaseLine(release.summary, release.versionType, release.doc).trim('\n')
  ).join('\n');

  return `
## ${pkg.version}
${releaseLines}
`;
}

module.exports = {
  generateMarkdownTemplate,
};
