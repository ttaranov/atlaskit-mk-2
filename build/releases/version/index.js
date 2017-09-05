const createChangesetCommit = require('./createChangesetCommit');
const createPublishCommitStr = require('./createPublishCommitStr');
const versionCommand = require('./versionCommand');

module.exports = {
  createChangesetCommit,
  createPublishCommitStr,
  run: versionCommand,
};
