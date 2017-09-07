const outdent = require('outdent');
const parseChangeSetCommit = require('../../version/parseChangeSetCommit');
const createChangesetCommit = require('../../version/createChangesetCommit');

const simpleChangeset = {
  summary: 'This is a summary',
  releases: [
    { name: 'package-a', type: 'minor' },
  ],
  dependents: [],
  commit: 'dec4a66',
};

describe('parseChangeSetCommit', () => {
  it('should be able to parse a commit message and return json', () => {
    const commitStr = outdent`
      CHANGESET: This is a summary

      Summary: Nothing in here matters for the parsing

      Release notes: path/to/release/notes.md

      Releases: package-a@minor, package-b@major

      Dependents: package-c@patch

      ---
      ${JSON.stringify(simpleChangeset)}
      ---
    `;
    const parsed = parseChangeSetCommit(commitStr);
    expect(parsed).toEqual(simpleChangeset);
  });

  it('should return the same json used to create it in createChangesetCommit', () => {
    const commitStr = createChangesetCommit(simpleChangeset);
    const parsed = parseChangeSetCommit(commitStr);
    expect(parsed).toEqual(simpleChangeset);
  });

  it('should not care about extra empty lines', () => {
    const commit = outdent`
      Version: This is a super cool version


      ---
      {"summary": "This is a super cool version","releaseNotes": "doc.md","releases":{"badge": "minor"}}
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
