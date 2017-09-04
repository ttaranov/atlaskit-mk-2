const changeSets = [
  {
    summary: 'We fix few bugs in badge.',
    doc: 'release.md',
    commit: '63uyea9',
    releases: {
      badge: 'patch',
    },
    dependents: {
      code: 'badge',
    },
  },
  {
    summary: 'We add in a new feature in lozenge',
    doc: 'release.md',
    commit: '37uue06',
    releases: {
      lozenge: 'minor',
    },
    dependents: {
      badge: 'lozenge',
    },
  },
];

module.exports = {
  releases: [
    {
      name: 'badge',
      version: 'v1.0.1',
      changeSets: [changeSets[0]],
    },
    {
      name: 'lozenge',
      version: 'v1.1.0',
      changeSets: [changeSets[1]],
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
