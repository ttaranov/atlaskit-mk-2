const createChangesetCommit = require('./createChangesetCommit');
const createRelease = require('./createRelease');
const changesetCommand = require('./changesetCommand');

module.exports = {
  createChangesetCommit,
  createRelease,
  run: changesetCommand,
};
