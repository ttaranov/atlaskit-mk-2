/** Publish commit message format

  RELEASING: Releasing 4 packages

  ---
  {
    releases: [{
      name: 'package-a',
      version: '1.1.0',
      commits: ['fc4229d', 'aeb543f']
    },
    {
      name: 'package-b'
      version: '1.0.1',
      commits: ['fc4229d', 'aeb543f']
      dependencies: ['package-a']
    }]
    changesets: [
      { commit: 'fc4229d', summary: 'Summary' }
    ],
  }
  ---
 *
 */

// releaseObj is a Release object created from the createReleaseObject function
// To create the commit string for a release, we mostly JSON.stringify, removing a few extraneous
// fields
function createReleaseCommit(releaseObj) {
  const numPackagesReleased = releaseObj.releases.length;

  const cleanReleaseObj = {};
  cleanReleaseObj.releases = releaseObj.releases;
  cleanReleaseObj.changesets = releaseObj.changesets.map(changeset => ({
    commit: changeset.commit,
    summary: changeset.summary,
  }));

  return `RELEASING: Releasing ${numPackagesReleased} packages

---
${JSON.stringify(cleanReleaseObj, null, 2)}
---`;
}

module.exports = createReleaseCommit;
