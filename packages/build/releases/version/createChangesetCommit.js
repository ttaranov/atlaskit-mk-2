/* Returns a string in the form:

CHANGESET: This is a truncated summary of the change....

Summary: This is the untruncated summary of the change

Release notes: path/to/release/notes.md

Releases: package-a@minor

Dependents: package-a@minor, package-b@minor, package-c@patch

---
{summary:'',releaseNotes?:'',commmit?:'',releases [{ name: 'package-a',type:'major'}],dependents:[{name:'package-b',type:'minor',dependencies: ['package-a']},{name:'package-c',type:'patch',dependencies:['package-b']},{name:'package-a',type:'patch',dependencies:['package-c']}]}
---
*/

function createVersionCommitStr(version) {
  const MAX_SUMMARY_LINE_LENTH = 100;
  const truncatedSummaryLine = `CHANGESET: ${version.summary}`.substring(0, MAX_SUMMARY_LINE_LENTH);

  const releaseNotesLine = version.releaseNotes || '<none>';
  const releasesLine = version.releases.map(release => `${release.name}@${release.type}`).join(', ');
  const dependentsLine = version.dependents.map(release => `${release.name}@${release.type}`).join(', ') || '[]';

  return `${truncatedSummaryLine}

Summary: ${version.summary}

Release notes: ${releaseNotesLine}

Releases: ${releasesLine}

Dependents: ${dependentsLine}

---
${JSON.stringify(version)}
---`;
}

module.exports = createVersionCommitStr;
