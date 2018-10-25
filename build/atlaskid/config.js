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
  'jmackison',
  'scurtis',
  'alexreardon',
  'pete_gleeson',
  'mgardiner_atlas',
  'padmaia',
  'vbelgiornozegna',
];
const editorTeam = [
  'imsysoev',
  'jyotiatl',
  'atlasmarco',
  'eshvedai',
  'scottsidwell',
  'rifat_nabi',
  'ckrishnakumar',
  'owallhult',
  'dsorin',
  'jmack2',
  'supertong',
  'jcoppinger',
  'agnes',
  'vsutrave',
  'ahixon_atlassian',
  'wangjerome',
  'nathanflew',
];
const elementsTeam = [
  'sguillope',
  'eduardo_soares',
  'Craig_Petchell',
  'jhoarau',
  'ttjandra',
  'pcurren',
  'lgpereira',
];
// Jono is a special case atm, and his team doesn't have a name
const jono = ['jonathan_yeo'];
const mediaTeam = [
  'hzarcogarcia',
  'sattard',
  'mjames91',
  'alichamas',
  'jluong',
  'amotsjonov',
  'jamesnewell',
  'abodera',
  'vvvlasov',
  'dklinnert',
  'iloire-atlassian',
  'ivandemchenko',
];
const searchAndSmartsTeam = [
  'drichard',
  'pteen',
  'ashwini_rattihalli',
  'fo2ad',
];
const kitkatTeam = [
  'kamil-kaczmarczyk',
  'mszerszynski',
  'kziajka123',
  'pmurawski_atlassian',
  'vpetrychuk',
  'bgryta',
];
const growthTeam = [
  'hchehab',
  'jcanoatlas',
  'kanishkpurohit',
  'anthonyrussell',
  'wiwong',
  'leandro_lemos',
  'rob_sangster',
  'mpuckeridge',
  'ilavskym',
];
const navigationTeam = [
  'jaredcroweatlassian',
  'jedw',
  'mblaszczyk-atlassian',
  'wmendesneto',
  'isriharsha',
  'lucaslago_atlassian',
];
const homeTeam = [
  'losang', // maintainer
  'damevin', // maintainer
  'sesther', // maintainer
  'erwinbolwidt',
  'zeev_gilovitz',
  'hmaher',
];
const bitbucketTeam = [
  'bgummer',
  'stacylondoner',
  'ttadej-atlassian',
  'mafrauen',
  'IvonneTerrero',
  'seanaty',
  'sogrady',
  'ebutleratlassian',
  'jpoh',
  'cdoan-atlassian',
  'peterwilliams-atl',
];
const usersAllowedToApprove = [].concat(
  atlaskitTeam,
  editorTeam,
  elementsTeam,
  jono,
  mediaTeam,
  searchAndSmartsTeam,
  kitkatTeam,
  growthTeam,
  navigationTeam,
  homeTeam,
  bitbucketTeam,
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
    repoUuid: '{6380b4e9-6ac5-4dd4-a8e0-65f09cabe4c8}',
  },
  ciConfig: {
    botUsername: botUsername,
    botPassword: botPassword,
    repoOwner: repoOwner,
    repoName: repoName,
  },
  prSettings: {
    requiredApprovals: 1,
    canApproveOwnPullRequest: false,
    requireClosedTasks: true,
    requireGreenBuild: true,
    allowLandWhenAble: true,
    usersAllowedToApprove: usersAllowedToApprove,
  },
};
