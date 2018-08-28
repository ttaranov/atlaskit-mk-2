import 'whatwg-fetch';

function commitsToValues(response) {
  return response.values;
}

function commitUrl(user, repo, pullrequestid, page) {
  return `/2.0/repositories/${user}/${repo}/pullrequests/${pullrequestid}/commits?page=${page}`;
}

export default function getCommits(user, repo, pullrequestid, page = 0) {
  return new Promise((resolve, reject) => {
    window.AP.require('request', request => {
      request({
        url: commitUrl(user, repo, pullrequestid, page),
        success(response) {
          if (response.next) {
            getCommits(user, repo, pullrequestid, page + 1).then(commits => {
              resolve(commitsToValues(response).concat(commits));
            });
          } else {
            resolve(commitsToValues(response));
          }
        },
        error(ex) {
          reject(`failed due to ${ex.toString()}`);
        },
      });
    });
  });
}
