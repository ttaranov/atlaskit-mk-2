const createRelease = require('../../version/createRelease');

const simpleChangeset = {
  summary: 'Adds a feature to package-a',
  releases: {
    'package-a': 'minor',
  },
  commit: '63d27a9',
};

describe('createRelease', () => {
  it('should handle a single simple changeset', () => {
    const releaseObj = createRelease([simpleChangeset]);
    expect(releaseObj).toEqual({
      releases: [
        { name: 'package-a', version: '1.1.0', commits: ['63d27a9'] },
      ],
      changesets: [{
        summary: 'Adds a feature to package-a',
        releases: {
          'package-a': 'minor',
        },
        commit: '63d27a9',
      }],
    });
  });
});
