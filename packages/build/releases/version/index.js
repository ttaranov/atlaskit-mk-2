const createChangesetCommit = require('./createChangesetCommit');
const createRelease = require('./createRelease');
const versionCommand = require('./versionCommand');

module.exports = {
  createChangesetCommit,
  createRelease,
  run: versionCommand,
};
