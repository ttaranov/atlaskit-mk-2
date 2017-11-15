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

function createChangesetCommitStr(changeset) {
  const MAX_SUMMARY_LINE_LENTH = 100;
  const truncatedSummaryLine = `CHANGESET: ${changeset.summary}`.substring(
    0,
    MAX_SUMMARY_LINE_LENTH,
  );

  const releaseNotesLine = changeset.releaseNotes || '<none>';
  const releasesLine = changeset.releases
    .map(release => `${release.name}@${release.type}`)
    .join(', ');
  const dependentsLine =
    changeset.dependents
      .map(release => `${release.name}@${release.type}`)
      .join(', ') || '[]';

  return `${truncatedSummaryLine}

Summary: ${changeset.summary}

Release notes: ${releaseNotesLine}

Releases: ${releasesLine}

Dependents: ${dependentsLine}

---
${JSON.stringify(changeset)}
---`;
}

module.exports = createChangesetCommitStr;
