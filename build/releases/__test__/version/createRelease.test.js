const createRelease = require('../../changeset/createRelease');

const fakeAllPackages = [
  { name: 'package-a', config: { version: '1.0.0' } },
  { name: 'package-b', config: { version: '1.0.0' } },
];
const simpleChangeset = {
  summary: 'This is a summary',
  releases: [
    { name: 'package-a', type: 'minor' },
  ],
  dependents: [],
  commit: 'dec4a66',
};
const simpleChangeset2 = {
  summary: 'This is another summary',
  releases: [
    { name: 'package-a', type: 'patch' },
  ],
  dependents: [],
  commit: '695fad0',
};

const changesetWithDep = {
  summary: 'This is another summary',
  releases: [
    { name: 'package-a', type: 'minor' },
  ],
  dependents: [
    { name: 'package-b', type: 'patch', dependencies: ['package-a'] },
  ],
  commit: '695fad0',
};

describe('createRelease', () => {
  it('should handle a single simple changeset', () => {
    const releaseObj = createRelease([simpleChangeset], fakeAllPackages);
    expect(releaseObj).toEqual({
      releases: [{ name: 'package-a', commits: ['dec4a66'], version: '1.1.0' }],
      changesets: [simpleChangeset],
    });
  });

  it('should flatten flatten commits in two simple changesets', () => {
    const releaseObj = createRelease([simpleChangeset, simpleChangeset2], fakeAllPackages);

    expect(releaseObj).toEqual({
      releases: [{ name: 'package-a', commits: ['dec4a66', '695fad0'], version: '1.1.0' }],
      changesets: [simpleChangeset, simpleChangeset2],
    });
  });

  it('should handle dependents', () => {
    const releaseObj = createRelease([changesetWithDep], fakeAllPackages);

    expect(releaseObj).toEqual({
      releases: [
        { name: 'package-a', commits: ['695fad0'], version: '1.1.0' },
        { name: 'package-b', commits: ['695fad0'], version: '1.0.1' },
      ],
      changesets: [changesetWithDep],
    });
  });
});
