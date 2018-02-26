// This file should never be checked in and is only used for local testing

const botUsername = process.env.BITBUCKET_USERNAME;
const botPassword = process.env.BITBUCKET_PASSWORD;
const prodBaseUrl =
  'https://atlaskit-atlaskid.us-west-1.staging.public.atl-paas.net';
const devBaseUrl =
  'https://atlaskit-atlaskid.ap-southeast-2.dev.public.atl-paas.net';
const repoOwner = 'atlassian';
const repoName = 'atlaskit-mk-2';
// Sorting these lists into teams to make this easier to maintain
const atlaskitTeam = [
  'luke_batchelor',
  'treshugart',
  'mathurajay',
  'charles_tm',
  'bconolly',
  'raja07',
  'thejameskyle',
  'mblaszczyk-atlassian',
  'jmackison',
  'scurtis',
  'jaredcroweatlassian',
  'jedw',
  'alexreardon',
  'pete_gleeson',
];
const editorAndElementsTeam = [
  'imsysoev',
  'jyotiatl',
  'ed919',
  'scottsidwell',
  'rifat_nabi',
  'Craig_Petchell',
  'ckrishnakumar',
  'ttjandra',
  'owallhult',
  'dsorin',
  'jmack2',
  'supertong',
  'pcurren',
  'jhoarau',
  'agnes',
  'vsutrave',
  'ahixon_atlassian',
];
const mediaTeam = [
  'sattard',
  'mjames91',
  'alichamas',
  'jluong',
  'amotsjonov',
  'hzarcogarcia',
  'jamesnewell',
  'abodera',
  'vvvlasov',
];
const usersAllowedToApprove = [].concat(
  atlaskitTeam,
  editorAndElementsTeam,
  mediaTeam,
);

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
