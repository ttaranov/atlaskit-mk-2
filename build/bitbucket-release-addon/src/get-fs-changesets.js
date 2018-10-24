function commitUrl(user, repo, pullrequestid, page) {
  return `/2.0/repositories/${user}/${repo}/pullrequests/${pullrequestid}/commits?page=1`;
}

function fetchFolderInfo(user, repo, node, folderPath) {
  return `/2.0/repositories/${user}/${repo}/src/${node}/${folderPath}`;
}

function getDiffStatFromMasterUrl(user, repo, hash, page) {
  return `/2.0/repositories/${user}/${repo}/diffstat/${hash}..master?page=${page}`;
}

function getFileUrl(user, repo, hash, filePath) {
  return `/2.0/repositories/${user}/${repo}/src/${hash}/${filePath}`;
}

function promisifyAPRequest(url) {
  return new Promise((resolve, reject) => {
    window.AP.require('request', request => {
      request({
        url: url,
        success(response) {
          resolve(response);
        },
        error(error) {
          reject(error);
        },
      });
    });
  });
}

function getFullDiffStat(user, repo, hash, page, allValues = []) {
  return promisifyAPRequest(
    getDiffStatFromMasterUrl(user, repo, hash, page),
  ).then(res => {
    if (res.next) {
      return getFullDiffStat(user, repo, hash, page + 1, [
        ...allValues,
        ...res.values,
      ]);
    }
    return [...allValues, ...res.values];
  });
}

function getSomething(user, repo, hashPromise, path) {
  return hashPromise.then(hash =>
    promisifyAPRequest(fetchFolderInfo(user, repo, hash, path)),
  );
}

export default function getChangesetInfo(user, repo, pullrequestid) {
  let hashPromise = promisifyAPRequest(
    commitUrl(user, repo, pullrequestid),
  ).then(response => {
    if (!response.values)
      throw new Error('Could not find latest commit on branch');
    return response.values[0].hash;
  });

  return hashPromise.then(hash =>
    getFullDiffStat(user, repo, hash, 1).then(allDiffStats => {
      const relevantDiffs = allDiffStats
        .filter(diff => diff.status !== 'removed')
        .filter(diff => diff.new.path.match(/\.changeset\/.+?\/changes.json$/))
        .map(diff => getFileUrl(user, repo, hash, diff.new.path))
        .map(promisifyAPRequest);
      return Promise.all(relevantDiffs);
    }),
  );
}
