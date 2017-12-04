import 'whatwg-fetch';

function commitsToValues(response) {
  return response.values;
}

export default function getCommits(user, repo, pullrequestid, page = 0) {
  return new Promise((resolve, reject) => {
    window.AP.require('request', request => {
      request({
        url: `/2.0/repositories/${user}/${repo}/pullrequests/${
          pullrequestid
        }/commits?page=${page}`,
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
