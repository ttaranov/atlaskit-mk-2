const spawn = require('projector-spawn');
const path = require('path');

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

module.exports = {
  getCommitsSince,
  getChangedFilesSince,
  getBranchName,
};
