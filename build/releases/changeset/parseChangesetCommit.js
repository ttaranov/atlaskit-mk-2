function parseChangesetCommit(commitMsg) {
  const lines = commitMsg.split('\n');
  let curLine;
  let jsonStr = '';

  // Throw away all the lines until we find the separator token
  do {
    curLine = lines.shift();
  } while (curLine !== '---');

  curLine = lines.shift(); // Thow away the separator line

  // Get the json parts
  while (curLine !== '---') {
    jsonStr += curLine;
    curLine = lines.shift();
  }

  // due to some badly structured JSON in some old releases (trailing commas) we have to do this
  try {
    JSON.parse(jsonStr);
  } catch (e) {
    return undefined;
  }
  return JSON.parse(jsonStr);
}

module.exports = parseChangesetCommit;
