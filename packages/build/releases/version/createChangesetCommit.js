/* Returns a string in the form:

Version: This is a truncated summary of the change....

---
{
  summary: 'This is the untruncated summary for the changeset',
  releaseNotes?: 'path/to/release/notes.md',
  releases {
    'package-a': 'minor'
  },
  dependents: {
    'package-c': ['package-a']
    'package-b': ['package-a', 'package-c'],
  }
}
---
*/

function createVersionCommitStr(version) {
  const MAX_SUMMARY_LINE_LENTH = 100;
  const truncatedSummaryLine = `Version: ${version.summary}`.substring(0, MAX_SUMMARY_LINE_LENTH);

  return `${truncatedSummaryLine}

---
${JSON.stringify(version, null, 2)}
---`;
}

module.exports = createVersionCommitStr;
