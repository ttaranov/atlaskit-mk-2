import queryString from 'query-string';

const { user, repo, pullrequestid } = queryString.parse(window.location.search);

console.log('HERE', user, repo, pullrequestid);
