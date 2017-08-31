/* Version Commit Message Format

Version: {truncated summary}

{Full summary}

Releases:
  {pkgName}@{bumpType}
  {pkgName}@{bumpType}

Dependents:
  {pkgName} is a dependent of {anotherPkgName}

*/

function createVersionCommitStr(version) {
  const MAX_SUMMARY_LINE_LENTH = 100;
  const truncatedSummaryLine = `Version: ${version.summary}`.substring(0, MAX_SUMMARY_LINE_LENTH);
  const releaseLines = Object.keys(version.releases)
    .map(pkgName => `  ${pkgName}@${version.releases[pkgName]}`);
  const dependentsLines = Object.keys(version.dependents)
    .map(pkgName => `  ${pkgName} is a dependent on ${version.dependents[pkgName]}`);

  return `${truncatedSummaryLine}

${version.summary}

Releases:
${releaseLines.join('\n')}

Dependents:
${dependentsLines.join('\n')}
`;
}

module.exports = createVersionCommitStr;
