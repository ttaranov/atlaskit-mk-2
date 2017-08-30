module.exports = [
  {
    release: 'release-1.md',
    summary: 'We fix few bugs in badge.',
    versions: [
      'badge@minor'
    ],
    commits: [
      {
        message: 'A typo in function badge',
        hash: '1-aaaaaaa',
      },
      {
        message: 'Badge renders in IE6 correctly now',
        hash: '1-bbbbbbb',
      }
    ],
  },
  {
    versions: [
      'lozenge@minor'
    ],
    commits: [
      {
        message: 'Fix javascript render error',
        hash: '2-ccccccc',
      },
      {
        message: 'Fix size of code block',
        hash: '2-ddddddd',
      }
    ],
  },
  {
    release: 'release-3.md',
    summary: 'Lozenge and badge are now in a better version',
    versions: [
      'badge@major',
      'lozenge@major'
    ],
    commits: [
      {
        message: 'Remove Ruby support',
        hash: '2-eeeeeee',
      },
      {
        message: 'Remove PHP support',
        hash: '2-fffffff',
      }
    ],
  }
];