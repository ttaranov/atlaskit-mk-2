const createRelease = require('../../version/createRelease');

const fakeAllPackages = [
  { name: 'package-a', config: { version: '1.0.0' } },
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
});
