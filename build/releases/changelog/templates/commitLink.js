/**
 * @param {string} hash - commit hash
 */
module.exports = (hash) => {
  return `[${hash}](${hash})`;
};