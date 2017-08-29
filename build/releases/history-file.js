const fs = require('fs');
const path = require('path');
const toml = require('toml');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function getHistory(opts) {
  const rootDir = opts.rootDir;
  const historyFilePath = path.join(rootDir, 'history.toml');
  const historyFile = await readFile(historyFilePath, 'utf-8');
  return toml.parse(historyFile);
}

async function validateHistoryFile(opts) {
  const historyFileValid = h => h['last-release'] && h.releases && Array.isArray(h.releases);
  const history = await getHistory(opts);
  return historyFileValid(history);
}

async function writeHistoryFile(history) {
  // The following will of course be replaced as well, just temporary so we can get `something`
  // working.
  let tomlFileStr = `# This document is used to track releases.
# It can be editted manually, but it is reccomended you use the \`yarn run version\` command.

# Hash of the last release from master
last-release = "${history['last-release']}" # latest 0b2c18c

`;
  history.releases.forEach(release => {
    tomlFileStr += releaseToTomlString(release);
  });

  fs.writeFileSync(path.join(__dirname, '..', '..', 'test.toml'), tomlFileStr);
}

// This is a temporary function until we think of a better way to write the toml strings back to
// the history file.
// `toml` doesnt support writing and `toml-js` only supports reading v0.1.0 of the toml spec which
// doesnt include multiple "array of tables".
// It might be that we need to read with one package and write with the other.
function releaseToTomlString(release) {
  const wrapInQuotes = str => `"${str}"`;
  return `[[releases]]
${release.release ? `name = "${release.name}` : '# no name'}"
${release.release ? `release = "${release.release}"` : '# no release file'}
commits = [
  ${release.commits.map(wrapInQuotes).join(',\n  ')}
]
versions = [
  ${release.versions.map(wrapInQuotes).join(',\n  ')}
]

`;
}

exports.getHistory = getHistory;
exports.validateHistoryFile = validateHistoryFile;
exports.writeHistoryFile = writeHistoryFile;

