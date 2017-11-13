const outdent = require('outdent');
const createChangesetCommit = require('../../changeset/createChangesetCommit');

describe('createChangesetCommit', () => {
  it('should create a valid changeset commit message', () => {
    const changeset = {
      summary: 'This is a summary',
      releaseNotes: 'path/to/release/notes.md',
      releases: [
        { name: 'package-a', type: 'minor' },
        { name: 'package-b', type: 'major' },
      ],
      dependents: [
        { name: 'package-c', type: 'patch', dependencies: ['package-a'] },
      ],
    };
    const commitStr = createChangesetCommit(changeset);

    expect(commitStr).toEqual(outdent`
      CHANGESET: This is a summary

      Summary: This is a summary

      Release notes: path/to/release/notes.md

      Releases: package-a@minor, package-b@major

      Dependents: package-c@patch

      ---
      ${JSON.stringify(changeset)}
      ---
    `);
  });

  it('should create commit messages without releaseNotes', () => {
    const changeset = {
      summary: 'This is a summary',
      releases: [{ name: 'package-a', type: 'minor' }],
      dependents: [],
    };
    const commitStr = createChangesetCommit(changeset);

    expect(commitStr).toEqual(outdent`
      CHANGESET: This is a summary

      Summary: This is a summary

      Release notes: <none>

      Releases: package-a@minor

      Dependents: []

      ---
      ${JSON.stringify(changeset)}
      ---
    `);
  });

  it('should create commit messages without dependents', () => {
    const changeset = {
      summary: 'This is a summary',
      releases: [{ name: 'package-a', type: 'minor' }],
      dependents: [],
    };
    const commitStr = createChangesetCommit(changeset);

    expect(commitStr).toEqual(outdent`
      CHANGESET: This is a summary

      Summary: This is a summary

      Release notes: <none>

      Releases: package-a@minor

      Dependents: []

      ---
      ${JSON.stringify(changeset)}
      ---
    `);
  });

  it('should truncate the summary line to 100 characters', () => {
    const changeset = {
      summary:
        'This is a summary that is super long so that it goes above the 100 character limit, so that it gets truncated',
      releases: [{ name: 'package-a', type: 'minor' }],
      dependents: [],
    };
    const commitStr = createChangesetCommit(changeset);
    const summaryLine = commitStr.split('\n')[0];
    expect(summaryLine.length).toEqual(100);
  });
});
