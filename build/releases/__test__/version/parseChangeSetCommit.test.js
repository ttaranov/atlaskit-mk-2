const parseChangeSetCommit = require('../../version/parseChangeSetCommit');

describe('parseChangeSetCommit', () => {
  it('should parse a changeset commit', () => {
    const commit = `
Version: This is a super cool version
---
{
  "summary": "This is a super cool version",
  "releaseNotes": "doc.md",
  "releases": {
    "badge": "minor"
  }
}
---
`;
    const version = parseChangeSetCommit(commit);
    expect(version).toEqual({
      summary: 'This is a super cool version',
      releaseNotes: 'doc.md',
      releases: {
        badge: 'minor',
      },
    });
  });

  it('should not care about empty lines', () => {
    const commit = `
Version: This is a super cool version


---
{
  "summary": "This is a super cool version",
  "releaseNotes": "doc.md",

  "releases": {
    "badge": "minor"
  }
}
---
`;
    const version = parseChangeSetCommit(commit);
    expect(version).toEqual({
      summary: 'This is a super cool version',
      releaseNotes: 'doc.md',
      releases: {
        badge: 'minor',
      },
    });
  });
});
