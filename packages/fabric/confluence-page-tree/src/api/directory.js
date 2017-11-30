// @flow
const DIRECTORY_PROD_URL =
  'https://api-private.atlassian.com/directory/graphql';
const DIRECTORY_STAG_URL =
  'https://api-private.stg.atlassian.com/directory/graphql';

const getDirectoryServiceEndpoint = (w?: Object = window): string => {
  let isProd = true;

  try {
    isProd = !(
      w.location.hostname.endsWith('jira-dev.com') ||
      w.location.hostname === 'localhost'
    );
  } catch (e) {
    // silence
  }

  return isProd ? DIRECTORY_PROD_URL : DIRECTORY_STAG_URL;
};

export { getDirectoryServiceEndpoint };
