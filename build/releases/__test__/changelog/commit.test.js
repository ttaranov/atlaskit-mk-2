
const { parseVersionCommit, groupByPackage } = require('../../changelog/commit');

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

describe('groupByPackage', () => {
  it('should group an version commit object by package name', () => {
    const versions = [
      {
        summary: 'We fix few bugs in badge.',
        doc: 'release.md',
        releases: [
          '@atlaskit/badge@patch',
        ],
        dependents: {
          '@atlaskit/code': '@atlaskit/badge',
        },
      },
    ];

    const result = groupByPackage(versions);
    expect(result.get('@atlaskit/badge')).toEqual({
      name: '@atlaskit/badge',
      releases: [
        {
          versionType: 'patch',
          summary: 'We fix few bugs in badge.',
          doc: 'release.md',
        },
      ],
    });

    expect(result.get('@atlaskit/code')).toEqual({
      name: '@atlaskit/code',
      releases: [
        {
          versionType: 'patch',
          summary: 'Update dependency on @atlaskit/badge',
        },
      ],
    });
  });

  it('should group multiple version commits object by package name', () => {
    const versions = [
      {
        summary: 'We fix few bugs in badge.',
        doc: 'release.md',
        releases: [
          'badge@patch',
        ],
        dependents: {
          code: 'badge',
        },
      },
      {
        summary: 'A super nice feature in lozenge.',
        doc: 'release.md',
        releases: [
          'lozenge@minor',
        ],
        dependents: {
          badge: 'lozenge',
        },
      },
    ];

    const result = groupByPackage(versions);
    expect(result.get('badge')).toEqual({
      name: 'badge',
      releases: [
        {
          versionType: 'patch',
          summary: 'We fix few bugs in badge.',
          doc: 'release.md',
        },
        {
          versionType: 'patch',
          summary: 'Update dependency on lozenge',
        },
      ],
    });

    expect(result.get('code')).toEqual({
      name: 'code',
      releases: [
        {
          versionType: 'patch',
          summary: 'Update dependency on badge',
        },
      ],
    });

    expect(result.get('lozenge')).toEqual({
      name: 'lozenge',
      releases: [
        {
          versionType: 'minor',
          summary: 'A super nice feature in lozenge.',
          doc: 'release.md',
        },
      ],
    });
  });

  it('should still work if doc is missing', () => {
    const versions = [
      {
        summary: 'We fix few bugs in badge.',
        releases: [
          '@atlaskit/badge@patch',
        ],
        dependents: {
          '@atlaskit/code': '@atlaskit/badge',
        },
      },
    ];

    const result = groupByPackage(versions);
    expect(result.get('@atlaskit/badge')).toEqual({
      name: '@atlaskit/badge',
      releases: [
        {
          versionType: 'patch',
          summary: 'We fix few bugs in badge.',
        },
      ],
    });

    expect(result.get('@atlaskit/code')).toEqual({
      name: '@atlaskit/code',
      releases: [
        {
          versionType: 'patch',
          summary: 'Update dependency on @atlaskit/badge',
        },
      ],
    });
  });
});
