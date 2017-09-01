module.exports = [
  {
    summary: 'We fix few bugs in badge.',
    doc: 'release.md',
    releases: [
      'badge@patch',
    ],
    dependents: [
      'code@patch',
    ],
  },
  {
    summary: 'A super nice feature in lozenge.',
    doc: 'release.md',
    releases: [
      'lozenge@minor',
    ],
    dependents: [
      'badge@patch',
    ],
  },
];
