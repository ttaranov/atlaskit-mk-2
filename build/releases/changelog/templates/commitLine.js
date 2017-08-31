const commitLink = require('./commitLink');

/**
 * @param {string} message - commit message
 * @param {string} hash - commit hash
 * @param {string} version - [major, minor, patch]
 */
module.exports = (message, hash, version) => {
  return `
- [${version}] ${message} (${commitLink(hash)})
`;
}