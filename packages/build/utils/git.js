const spawn = require('projector-spawn');
const path = require('path');

// Parses lines that are in the form 'HASH message goes here'
const parseCommitLine = line => {
  // ignore first result, it is the whole pattern match
  const [_, hash, message] = line.match(/([^ ]+) (.+)/);
  return { commit: hash, message };
};

async function getCommitsSince(ref) {
  const gitCmd = await spawn('git', ['rev-list', '--no-merges', '--abbrev-commit', `${ref}..HEAD`]);
  return gitCmd.stdout.trim().split('\n');
}

async function getChangedFilesSince(ref, fullPath = false) {
  const gitCmd = await spawn('git', ['diff', '--name-only', `${ref}..HEAD`]);
  const files = gitCmd.stdout.trim().split('\n');
  if (!fullPath) return files;
  return files.map(file => path.resolve(file));
}

async function getBranchName() {
  const gitCmd = await spawn('git', ['rev-parse', '--abrev-ref', 'HEAD']);
  return gitCmd.stdout.trim().split('\n');
}

async function commit(message) {
  const gitCmd = await spawn('git', ['commit', '-m', message, '--allow-empty']);
  return gitCmd.code === 0;
}

async function push(args = []) {
  const gitCmd = await spawn('git', ['push', ...args]);
  return gitCmd.code === 0;
}

async function getFullCommit(ref) {
  const gitCmd = await spawn('git', ['show', ref]);
  const lines = gitCmd.stdout.trim().split('\n');

  const hash = lines.shift().replace('commit ', '').substring(0, 7);
  const author = lines.shift().replace('Author: ', '');
  const date = new Date(lines.shift().replace('Date: ', '').trim());

  // remove the extra padding added by git show
  const message = lines.map(line => line.replace('    ', ''))
    .join('\n')
    .trim(); // There is one more extra line added by git
  return {
    commit: hash,
    author,
    date,
    message,
  };
}

async function getLastPublishCommit() {
  const isPublishCommit = msg => msg.startsWith('RELEASING: ');

  const gitCmd = await spawn('git', ['log', '-n', 50, '--oneline']);
  const result = gitCmd.stdout.trim().split('\n')
    .map(line => parseCommitLine(line));
  const latestPublishCommit = result.find(res => isPublishCommit(res.message));

  return latestPublishCommit.commit;
}

async function getChangesetCommitsSince(ref) {
  const isChangesetCommit = msg => msg.startsWith('CHANGESET: ');

  const gitCmd = await spawn('git', ['log', `${ref}...`, '--oneline']);
  const result = gitCmd.stdout.trim();

  if (result.length === 0) return [];

  const parsedResults = result.split('\n').map(line => parseCommitLine(line));
  const changesetCommits = parsedResults.filter(res => isChangesetCommit(res.message))
    .map(res => res.commit);

  return changesetCommits;
}

module.exports = {
  getCommitsSince,
  getChangedFilesSince,
  getBranchName,
  commit,
  push,
  getFullCommit,
  getLastPublishCommit,
  getChangesetCommitsSince,
};
