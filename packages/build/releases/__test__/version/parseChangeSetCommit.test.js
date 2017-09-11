const parseChangeSetCommit = require('../../version/parseChangeSetCommit');

describe('parseChangeSetCommit', () => {
  it('should parse a changeset commit', () => {
    const commit = `
CHANGESET: This is a truncated summary of the change....
Summary: This is the untruncated summary

Releases: package-a

Dependents: package-a, package-b, package-c
---
{
  "summary": "This is a super cool version",
  "releaseNotes": "doc.md",
  "releases": [
    {
      "name": "package-a",
      "type": "major"
    }
  ],
  "dependents": [
    {"name": "package-b", "type": "minor", "dependencies": ["package-a"]},
    {"name": "package-c", "type": "patch", "dependencies": ["package-b"]},
    {"name": "package-a", "type": "patch", "dependencies": ["package-c"]}
  ]
}
---
`;
    const version = parseChangeSetCommit(commit);
    expect(version).toEqual({
      summary: 'This is a super cool version',
      releaseNotes: 'doc.md',
      releases: [
        {
          name: 'package-a',
          type: 'major',
        },
      ],
      dependents: [
        { name: 'package-b', type: 'minor', dependencies: ['package-a'] },
        { name: 'package-c', type: 'patch', dependencies: ['package-b'] },
        { name: 'package-a', type: 'patch', dependencies: ['package-c'] },
      ],
    });
  });

  it('should not care about empty lines', () => {
    const commit = `
CHANGESET: This is a truncated summary of the change....
Summary: This is the untruncated summary

Releases: package-a

Dependents: package-a, package-b, package-c

---
{
  "summary": "This is a super cool version",
  "releaseNotes": "doc.md",

  "releases": [
    {
      "name": "package-a",
      "type": "major"

    }
  ],
  "dependents": [
    {"name": "package-b", "type": "minor", "dependencies": ["package-a"]},

    {"name": "package-c", "type": "patch", "dependencies": ["package-b"]},
    {"name": "package-a", "type": "patch", "dependencies": ["package-c"]}

  ]
}
---
`;
    const version = parseChangeSetCommit(commit);
    expect(version).toEqual({
      summary: 'This is a super cool version',
      releaseNotes: 'doc.md',
      releases: [
        {
          name: 'package-a',
          type: 'major',
        },
      ],
      dependents: [
        { name: 'package-b', type: 'minor', dependencies: ['package-a'] },
        { name: 'package-c', type: 'patch', dependencies: ['package-b'] },
        { name: 'package-a', type: 'patch', dependencies: ['package-c'] },
      ],
    });
  });
});
