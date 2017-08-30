const commitLink = require('./commitLink');

/**
 * @param {string} title - release title
 * @param {string[]} commits - array of commit hashes
 * @param {string} version - [major, minor, patch]
 * @param {string} doc - path to release doc
 */
module.exports = (title, commits, version, doc) => {
  const header = doc ? 
    `- [Release] ${title} [${version}] [Read More](${doc})` :
    `- [Release] ${title} [${version}]`
  const commitList = commits ?
    `  [ ${commits.map(e => commitLink(e)).join(', ')} ]` :
    '';

  return `
${header}
${commitList}
`;
}
