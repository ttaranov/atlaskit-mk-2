
const { parseVersionCommit } = require('../../changelog/commit');

describe('parseVersionCommit', () => {
  it('should parse a version commit', () => {
    const commit = `
Version: This is a super cool version
Doc: doc.md
Releases:
  badge@minor
Dependents:
  code:badge
`;
    const version = parseVersionCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      doc: 'doc.md',
      releases: [
        'badge@minor',
      ],
      dependents: {
        code: 'badge',
      },
    });
  });

  it('should parse a version commit without Doc', () => {
    const commit = `
Version: This is a super cool version
Releases:
  badge@minor
Dependents:
  code:badge
`;
    const version = parseVersionCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      doc: '',
      releases: [
        'badge@minor',
      ],
      dependents: {
        code: 'badge',
      },
    });
  });

  it('should not care about empty lines', () => {
    const commit = `
Version: This is a super cool version


Doc: doc.md



Releases:

  badge@minor

Dependents:
  code:badge


`;
    const version = parseVersionCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      doc: 'doc.md',
      releases: [
        'badge@minor',
      ],
      dependents: {
        code: 'badge',
      },
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
      releases: [],
      dependents: {},
    });
  });

  it('should stop parsing releases if invalid line found', () => {
    const commit = `
Version: This is a super cool version
Doc: doc.md
Releases:
  badge@minor
  code@major
  shit!
  cool@major
`;
    const version = parseVersionCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      doc: 'doc.md',
      releases: [
        'badge@minor',
        'code@major',
      ],
      dependents: {},
    });
  });

  it('should handle namespaced package correctly', () => {
    const commit = `
Version: This is a super cool version
Doc: doc.md
Releases:
  @atlaskit/badge@minor
Dependents:
  @atlaskit/code:@atlaskit/badge
`;
    const version = parseVersionCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      doc: 'doc.md',
      releases: [
        '@atlaskit/badge@minor',
      ],
      dependents: {
        '@atlaskit/code': '@atlaskit/badge',
      },
    });
  });
});
