const createReleaseCommit = require('../../version/createReleaseCommit');

const simpleRelease = {
  summary: 'This is a summary',
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
};

describe('createReleaseCommit', () => {
  it('should handle a single simple releaseObject with one released package', () => {
    const commitStr = createReleaseCommit(simpleRelease);
    expect(commitStr).toEqual(`RELEASING: Releasing 1 packages

---
{
  "releases": [
    {
      "name": "package-a",
      "version": "1.1.0",
      "commits": [
        "63d27a9"
      ]
    }
  ],
  "changesets": [
    {
      "commit": "63d27a9",
      "summary": "Adds a feature to package-a"
    }
  ]
}
---`);
  });
});
