
/**
 *
 * @param {string[]} commitMsg
 */
function parseVersionCommit(commitMsg) {
  const lines = commitMsg.filter(line => typeof line === 'string' && line.trim().length !== 0);

  if (lines.length <= 0 && !lines[0].startsWith('Version:')) {
    // This is not a version commit, I don't care
    return null;
  }

  const versionCommit = {
    summary: '',
    doc: '',
    versions: [],
  };
  const [, summary] = lines[0].split(':');
  versionCommit.summary = summary.trim();

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].startsWith('Release:') || lines[i].startsWith('Dependents:')) {
      const newVersions = parseReleaseBlock(lines.slice(i + 1));
      versionCommit.versions = versionCommit.versions.concat(newVersions);
    } else if (lines[i].startsWith('Doc')) {
      versionCommit.doc = parseDocLine(lines[i]);
    }
  }
  return versionCommit;
}

/**
 *
 * @param {string[]} lines
 */
function parseReleaseBlock(lines) {
  const regx = /[\w\d-_]+@(major|minor|patch)$/i;
  const validLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().match(regx)) {
      validLines.push(lines[i].trim());
    } else {
      // As long as we find an invalid line, we don't keep looking
      return validLines;
    }
  }
  return validLines;
}

function parseDocLine(line) {
  const [, doc] = line.split(':');
  return doc.trim();
}

module.exports = {
  parseVersionCommit,
};
