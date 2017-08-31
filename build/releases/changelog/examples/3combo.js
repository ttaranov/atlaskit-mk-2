module.exports = [
  {
    release: 'release-1.md',
    summary: 'We fix few bugs in badge.',
    versions: [
      'badge@minor',
    ],
    commits: [
      {
        message: 'A typo in function badge',
        hash: 'ff1d01d',
      },
      {
        message: 'Badge renders in IE6 correctly now',
        hash: '2d9b624',
      },
    ],
  },
  {
    versions: [
      'lozenge@minor',
    ],
    commits: [
      {
        message: 'Fix javascript render error',
        hash: '1b52498',
      },
      {
        message: 'Fix size of code block',
        hash: '75f11b9',
      },
    ],
  },
  {
    release: 'release-3.md',
    summary: 'Lozenge and badge are now in a better version',
    versions: [
      'badge@major',
      'lozenge@major',
    ],
    commits: [
      {
        message: 'Remove Ruby support',
        hash: '8c4cc25',
      },
      {
        message: 'Remove PHP support',
        hash: 'a249fdd',
      },
    ],
  },
];
