/**
 * @param {string} summary - release title
 * @param {string} versionType - [major, minor, patch]
 * @param {string} doc - path to release doc
 * A release line should look like:
 * - [minor] summary of change [hash](link/to/commit/hash)
 *   - See [doc.md](path/to/doc.md) for more information
 */
function releaseLine(summary, versionType, doc, commit, repoUrl) {
  const result = [];
  result.push(`- [${versionType}] ${summary} ${commitLink(commit, repoUrl)}`);
  if (doc) {
    result.push(`  - See [${doc}](${doc}) for more information`);
  }
  return result.join('\n').trim();
}

function commitLink(commit, repoUrl) {
  return repoUrl
    ? `[${commit}](${repoUrl}/${commit})`
    : `[${commit}](${commit})`;
}
/**
  // an example structure to help understand this
 {
      releases: [
        {
          name: '@atlaskit/badge',
          version: '1.0.0',
          commits: ['496287c'],
        },
        {
          name: '@atlaskit/code',
          version: '1.0.1',
          commits: ['496287c'],
        },
      ],
      changesets: [
        {
          summary: 'We fix few bugs in badge.',
          releaseNotes: 'release.md',
          commit: '496287c',
          releases: [
            {
              name: '@atlaskit/badge',
              type: 'patch',
            },
          ],
          dependents: [
            {
              name: '@atlaskit/code',
              type: 'minor',
              dependencies: ['@atlaskit/badge'],
            },
          ],
        },
      ],
    };
 */
// release is the package and version we are releasing
function generateMarkdownTemplate(release, releaseObject, repoUrl) {
  // NOTE: The release object we receive here has more information than the ones in relase commit
  // messages
  const { changesets, releases } = releaseObject;
  const result = [`## ${release.version}`];

  // get changesets that "release" this package (not a dependent bump)
  const releaseChangesets = changesets.filter(cs =>
    cs.releases.find(r => r.name === release.name),
  );
  // get changesets that bump our dependenies
  const dependentChangesets = changesets.filter(cs =>
    cs.dependents.find(d => d.name === release.name),
  );

  // First, we construct the release lines, summaries of changesets that caused us to be released
  releaseChangesets.forEach(changeset => {
    const relevantRelease = changeset.releases.find(
      r => r.name === release.name,
    );
    const releaseLineStr = releaseLine(
      changeset.summary,
      relevantRelease.type,
      changeset.releaseNotes,
      changeset.commit,
      repoUrl,
    );
    result.push(releaseLineStr);
  });

  // Now we create the dependency bumping section. We want to dedupe the dependencies and commmit
  // links so that this isn't too long.
  // We want one line per dependent changeset showing the bumpType and link
  // then one line per dependency bumped. i.e
  // - [patch] Updated dependencies [hash](link/to/hash)
  // - [minor] Updated dependencies [hash](link/to/hash)
  //   - @atlaskit/avatar@1.0.1
  //   - @atlaskit/button@2.0.0
  const dependenciesUpdated = new Set(); // We use a set so we can dedupe on the fly
  dependentChangesets.forEach(changeset => {
    const relevantDependent = changeset.dependents.find(
      d => d.name === release.name,
    );
    relevantDependent.dependencies.forEach(dep => dependenciesUpdated.add(dep));
    // At the same time, we'll add the "Updated dependencies" line to save us looping again
    result.push(
      `- [${relevantDependent.type}] Updated dependencies ${commitLink(
        changeset.commit,
        repoUrl,
      )}`,
    );
  });
  // Now we can print all the dependencies we updated
  Array.from(dependenciesUpdated).forEach(dependency => {
    const release = releases.find(r => r.name === dependency);
    result.push(`  - ${dependency}@${release.version}`);
  });

  return result.filter(line => line).join('\n');
}

module.exports = {
  generateMarkdownTemplate,
};
