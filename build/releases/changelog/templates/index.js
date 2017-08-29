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
  return `
## ${package.version}
${package.summaries.map(e => releaseLine(e.message, e.commits, e.version, e.doc)).join('\n')}
${package.commits.map(e => commitLine(e.message, e.hash, e.version)).join('\n')}
`;
}
