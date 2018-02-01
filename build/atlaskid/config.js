// This file should never be checked in and is only used for local testing

const botUsername = process.env.BITBUCKET_USERNAME;
const botPassword = process.env.BITBUCKET_PASSWORD;
const prodBaseUrl =
  'https://atlaskit-atlaskid.us-west-1.staging.public.atl-paas.net';
const devBaseUrl =
  'https://atlaskit-atlaskid.ap-southeast-2.dev.public.atl-paas.net';
const repoOwner = 'atlassian';
const repoName = 'atlaskit-mk-2';
const usersAllowedToApprove = ['luke_batchelor', 'thejameskyle'];

module.exports = {
  host: 'bitbucket',
  ci: 'bitbucket-pipelines',
  baseUrl: prodBaseUrl,
  port: 8080,
  hostConfig: {
    botUsername: botUsername,
    botPassword: botPassword,
    repoOwner: repoOwner,
    repoName: repoName,
    usersAllowedToApprove: usersAllowedToApprove,
  },
  ciConfig: {
    botUsername: botUsername,
    botPassword: botPassword,
    repoOwner: repoOwner,
    repoName: repoName,
  },
};
