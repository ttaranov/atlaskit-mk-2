/* Version Commit Message Format

Version: {truncated summary}

{Full summary}

Release Notes: {path to release notes - This line can be missing}

Releases:
  {pkgName}@{bumpType}
  {pkgName}@{bumpType}

Dependents:
  {pkgName}: {dependency}, {anotherDependency}

*/

function createVersionCommitStr(version) {
  const MAX_SUMMARY_LINE_LENTH = 100;
  const truncatedSummaryLine = `Version: ${version.summary}`.substring(0, MAX_SUMMARY_LINE_LENTH);
  const releaseLines = Object.keys(version.releases)
    .map(pkgName => `  ${pkgName}@${version.releases[pkgName]}`);
  const dependentsLines = Object.entries(version.dependents)
    .map(([dependent, dependencies]) => `  ${dependent}: ${dependencies.join(', ')}`);

  return `${truncatedSummaryLine}

${version.summary}

${version.releaseNotes ? `Release notes: ${version.releaseNotes}` : ''}

Releases:
${releaseLines.join('\n')}

Dependents:
${dependentsLines.join('\n')}
`;
}

module.exports = createVersionCommitStr;
