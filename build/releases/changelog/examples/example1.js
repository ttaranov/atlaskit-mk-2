const changeSets = [
  {
    summary: 'We fix few bugs in badge.',
    releaseNotes: 'release.md',
    commit: '63uyea9',
    releases: {
      badge: 'patch',
    },
  },
  {
    summary: 'We add in a new feature in lozenge',
    releaseNotes: 'release.md',
    commit: '37uue06',
    releases: {
      lozenge: 'minor',
    },
  },
];

module.exports = {
  releases: [
    {
      name: 'badge',
      version: 'v1.0.1',
      changeSets: [changeSets[0].commit],
    },
    {
      name: 'lozenge',
      version: 'v1.1.0',
      changeSets: [changeSets[1].commit],
    },
  ],
  dependents: [
    {
      name: 'code',
      version: 'v3.4.5',
      dependencies: [
        {
          name: 'badge',
          version: 'v1.0.1',
          commits: ['63uyea9'],
        },
      ],
    },
    {
      name: 'badge',
      version: 'v1.0.1',
      dependencies: [
        {
          name: 'lozenge',
          version: 'v1.1.0',
          commits: ['37uue06'],
        },
      ],
    },
  ],
  changeSets,
};
