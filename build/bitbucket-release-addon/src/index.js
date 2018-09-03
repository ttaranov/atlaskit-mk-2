import queryString from 'query-string';
import parseChangesetCommit from '@atlaskit/build-releases/changeset/parseChangesetCommit';
import flattenChangesets from '@atlaskit/build-releases/version/flattenChangesets';

import getCommits from './get-commits';

const noCommitsMessage = `<div style="border: 2px solid red; padding: 10px; border-radius: 10px; display: inline-block;">
  <p><strong>Warning:</strong> No packages will be released with this PR</p>
  <p>If this was not intentional make sure you have run \`bolt changeset\` if you are trying to release packages.</p>
  <p>See <a href="https://bitbucket.org/atlassian/atlaskit-mk-2/src/HEAD/docs/guides/07-releasing-packages.md" target="_parent">this guide</a> for more details.</p>

</div>`;
const errorLoadingCommitsMessage = `<div style="color: red; border: 2px solid; padding: 10px; border-radius: 10px; display: inline-block;">
<p>Error loading commits for this PR</p>
</div>`;
function releasesToHtmlList(releases) {
  return `<ul>
    ${releases.map(release => release.name).join(', ')}
  </ul>`;
}
const releasedPackagesMessage = releases => {
  const majorReleases = releases.filter(release => release.type === 'major');
  const minorReleases = releases.filter(release => release.type === 'minor');
  const patchReleases = releases.filter(release => release.type === 'patch');

  const majorReleasesSection =
    majorReleases.length > 0
      ? `<h3>💥 Major Releases</h3>${releasesToHtmlList(majorReleases)}`
      : '';
  const minorReleasesSection =
    minorReleases.length > 0
      ? `<h3>✨ Minor Releases</h3>${releasesToHtmlList(minorReleases)}`
      : '';
  const patchReleasesSection =
    patchReleases.length > 0
      ? `<h3>🛠 Patch Releases</h3>${releasesToHtmlList(patchReleases)}`
      : '';

  return `<div style="color: green; border: 1px solid; padding: 10px; border-radius: 10px; display: inline-block;">
    ${majorReleasesSection}
    ${minorReleasesSection}
    ${patchReleasesSection}
  </div>`;
};

const { user, repo, pullrequestid } = queryString.parse(window.location.search);
getCommits(user, repo, pullrequestid)
  .then(commits => {
    const changesetCommits = commits
      .map(commit => commit.message)
      .filter(commit => !!commit.match(/^CHANGESET: .+?\n/))
      .map(parseChangesetCommit);
    if (changesetCommits.length === 0) {
      document.body.innerHTML = noCommitsMessage;
      return;
    }
    const releases = flattenChangesets(changesetCommits);

    document.body.innerHTML = releasedPackagesMessage(releases);
  })
  .catch(() => {
    document.body.innerHTML = errorLoadingCommitsMessage;
  });
