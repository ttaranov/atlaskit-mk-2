const createChangesetCommit = require('../../version/createChangesetCommit');

describe('createChangesetCommit', () => {
  it('should create a valid changeset commit message', () => {
    const changeset = {
      summary: 'This is a summary',
      releases: {
        'package-a': 'minor',
        'package-b': 'major',
      },
      releaseNotes: 'path/to/release/notes.md',
    };
    const commitStr = createChangesetCommit(changeset);
    expect(commitStr).toEqual(`Version: This is a summary

---
{
  "summary": "This is a summary",
  "releases": {
    "package-a": "minor",
    "package-b": "major"
  },
  "releaseNotes": "path/to/release/notes.md"
}
---`);
  });

  it('should create commit messages without releaseNotes', () => {
    const changeset = {
      summary: 'This is a summary',
      releases: {
        'package-a': 'minor',
        'package-b': 'major',
      },
    };
    const commitStr = createChangesetCommit(changeset);
    expect(commitStr).toEqual(`Version: This is a summary

---
{
  "summary": "This is a summary",
  "releases": {
    "package-a": "minor",
    "package-b": "major"
  }
}
---`);
  });

  it('should truncate the summary line to 100 characters', () => {
    const changeset = {
      summary: 'This is a summary that is super long so that it goes above the 100 character limit, so that it gets truncated',
      releases: {
        'package-a': 'minor',
        'package-b': 'major',
      },
    };
    const commitStr = createChangesetCommit(changeset);
    const summaryLine = commitStr.split('\n')[0];
    expect(summaryLine.length).toEqual(100);
  });
});
