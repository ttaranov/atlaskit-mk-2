function commitUrl(user, repo, pullrequestid, page) {
  return `/2.0/repositories/${user}/${repo}/pullrequests/${pullrequestid}/commits?page=1`;
}

function fetchFolderInfo(user, repo, node, folderPath) {
  return `/2.0/repositories/${user}/${repo}/src/${node}/${folderPath}`;
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

  return hashPromise
    .then(hash =>
      promisifyAPRequest(fetchFolderInfo(user, repo, hash, '.changeset')).catch(
        e => {
          if (e.code === 'request_failed') throw 'resolve';
          else throw e;
        },
      ),
    )
    .then(response =>
      response.values
        .filter(({ type }) => type === 'commit_directory')
        .map(({ path }) => path),
    )
    .then(paths =>
      Promise.all(
        paths.map(path => getSomething(user, repo, hashPromise, path)),
      ),
    )
    .then(folders =>
      folders
        .map(folder =>
          folder.values.find(file =>
            file.links.self.href.match(/.*\/changes\.json/),
          ),
        )
        .map(file => file.links.self.href),
    )
    .then(links => Promise.all(links.map(promisifyAPRequest)))
    .catch(e => {
      if (e === 'resolve') return [];
      else throw e;
    });
}
