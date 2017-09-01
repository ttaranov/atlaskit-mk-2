
const { parseVersionCommit, groupByPackage } = require('../../changelog/commit');

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

  it('should handle namespaced package correctly', () => {
    const commit = `
Version: This is a super cool version
Doc: doc.md
Release:
  @atlassian/badge@minor
  @atlassian/code@major
`;
    const version = parseVersionCommit(commit.split('\n'));
    expect(version).toEqual({
      summary: 'This is a super cool version',
      doc: 'doc.md',
      versions: [
        '@atlassian/badge@minor',
        '@atlassian/code@major',
      ],
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
        dependents: [
          '@atlaskit/code@patch',
        ],
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
          versionType: 'dependent',
          summary: 'We fix few bugs in badge.',
          doc: 'release.md',
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
        dependents: [
          'code@patch',
        ],
      },
      {
        summary: 'A super nice feature in lozenge.',
        doc: 'release.md',
        releases: [
          'lozenge@minor',
        ],
        dependents: [
          'badge@patch',
        ],
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
          versionType: 'dependent',
          summary: 'A super nice feature in lozenge.',
          doc: 'release.md',
        },
      ],
    });

    expect(result.get('code')).toEqual({
      name: 'code',
      releases: [
        {
          versionType: 'dependent',
          summary: 'We fix few bugs in badge.',
          doc: 'release.md',
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
        dependents: [
          '@atlaskit/code@patch',
        ],
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
          versionType: 'dependent',
          summary: 'We fix few bugs in badge.',
        },
      ],
    });
  });
});
