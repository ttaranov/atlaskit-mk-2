
const { parseVersionCommit } = require('../../changelog/commit');

describe('parseVersionCommit', () => {
  it('should parse a version commit', () => {
    const commit = `
Version: This is a super cool version
Doc: doc.md
Release:
  badge@minor
  code@major
`;
    const version = parseVersionCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      doc: 'doc.md',
      versions: [
        'badge@minor',
        'code@major',
      ],
    });
  });

  it('should parse a version commit without Doc', () => {
    const commit = `
Version: This is a super cool version
Release:
  badge@minor
  code@major
`;
    const version = parseVersionCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      doc: '',
      versions: [
        'badge@minor',
        'code@major',
      ],
    });
  });

  it('should not care about empty lines', () => {
    const commit = `
Version: This is a super cool version


Doc: doc.md



Release:

  badge@minor

  code@major


`;
    const version = parseVersionCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      doc: 'doc.md',
      versions: [
        'badge@minor',
        'code@major',
      ],
    });
  });

  it('should still be ok if release is empty', () => {
    const commit = `
Version: This is a super cool version
Doc: doc.md
Release:
`;
    const version = parseVersionCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      doc: 'doc.md',
      versions: [],
    });
  });

  it('should stop parsing releases if invalid line found', () => {
    const commit = `
Version: This is a super cool version
Doc: doc.md
Release:
  badge@minor
  code@major
  shit!
  cool@major
`;
    const version = parseVersionCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      doc: 'doc.md',
      versions: [
        'badge@minor',
        'code@major',
      ],
    });
  });
});
