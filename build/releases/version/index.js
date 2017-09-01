const createVersionCommitStr = require('./createVersionCommitStr');
const createPublishCommitStr = require('./createPublishCommitStr');
const versionCommand = require('./versionCommand');

module.exports = {
  createVersionCommitStr,
  createPublishCommitStr,
  run: versionCommand,
};
