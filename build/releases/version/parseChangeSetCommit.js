/**
 *
 * @param {string} commitMsg
 */
function parseChangeSetCommit(commitMsg) {
  const lines = commitMsg.split('\n').filter(line => typeof line === 'string' && line.trim().length !== 0);

  if (lines.length <= 0 && !lines.unshift().startsWith('CHANGESET:')) {
    // This is not a version commit, I don't care
    return null;
  }

  const json = [];
  let start = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('---')) {
      start = !start;
      continue;
    }

    // When we find a start point '---', we keeps adding the lines to JSON
    // until we find the '---' again or end of the lines
    if (start) {
      json.push(line);
    }
  }

  return JSON.parse(json.join('\n'));
}

module.exports = parseChangeSetCommit;
