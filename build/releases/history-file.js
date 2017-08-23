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

async function updateHistoryFile(newRelease, opts) {
  const history = await getHistory(opts);
  const tomlString = releaseToTomlString(newRelease);

  // The following will of course be replaced as well, just temporary so we can get `something`
  // working.
  let tomlFileStr = `# This document is used to track releases.
# It can be editted manually, but it is reccomended you use the \`yarn run version\` command.

# Hash of the last release from master
last-release = "${history['last-release']}" # latest 0b2c18c

${releaseToTomlString(newRelease)}`;
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
  // luckily these are indented already so things look normal here
  return `[[releases]]
  ${release.release ? `name = "${release.name}` : '# no name'}"
  ${release.release ? `release = "${release.release}"` : '# no release file'}
  commits = [
    ${release.commits.map(wrapInQuotes).join(',\n    ')}
  ]
  versions = [
    ${release.versions.map(wrapInQuotes).join(',\n    ')}
  ]

`;
}

function wrapInQuotes(str) {
  return `"${str}"`;
}

const release = {
  name: 'foo',
  // release: 'releases/myRelease.md',
  commits: [
    '1122334',
    '1122335',
  ],
  versions: [
    'package-1@minor',
    'package-1@minor',
  ],
};

const history = toml.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'history.toml'), 'utf-8'));

addNewRelease(history, release, {});

exports.getHistory = getHistory;
exports.validateHistoryFile = validateHistoryFile;
exports.updateHistoryFile = updateHistoryFile;

