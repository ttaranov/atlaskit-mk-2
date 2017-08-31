const releaseLine = require('./releaseLine');
const commitLine = require('./commitLine');

/**
 * @param {Object} package
 * @param {string} package.version - [major, minor, patch]
 * @param {Object[]} package.summaries
 * @param {string} package.summaries[].message
 * @param {string[]} package.summaries[].commits
 * @param {string} package.summaries[].version
 * @param {string} package.summaries[].doc
 * @param {Object[]} package.commits
 * @param {string} package.commits[].message
 * @param {string} package.commits[].hash
 * @param {string} package.commits[].version
 */
module.exports = (package) => {
  const summaryBlocks = package.summaries.map((summary) => {
    return releaseLine(summary.message, summary.commits, summary.version, summary.doc).trim('\n');
  }).join('\n');
  const commitList = package.commits.map((commit) => {
    return commitLine(commit.message, commit.hash, commit.version).trim('\n');
  }).join('\n');

  return `
## ${package.version}
${summaryBlocks}
${commitList}
`;
}
