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
  },
  "dependents": {
    "code": ["badge"]
  }
}
---
`;
    const version = parseChangeSetCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      releaseNotes: 'doc.md',
      releases: {
        badge: 'minor',
      },
      dependents: {
        code: ['badge'],
      },
    });
  });
});
