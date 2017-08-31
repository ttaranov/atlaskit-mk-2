const commitLink = require('./commitLink');

/**
 * @param {string} title - release title
 * @param {string[]} commits - array of commit hashes
 * @param {string} version - [major, minor, patch]
 * @param {string} doc - path to release doc
 */
module.exports = (title, commits, version, doc) => {
  const result = [];
  result.push(`- [${version}] ${title}`);
  if (doc) {
    result.push(`  - See [${doc}](${doc}) for more information`);
  }
  if (commits) {
    result.push(`  - [ ${commits.map(e => commitLink(e)).join(', ')} ]`);
  }
  return result.join('\n');
}
