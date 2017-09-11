const { generateMarkdownTemplate } = require('../../changelog/template');

describe('template', () => {
  it('should generate template from a simple release object', () => {
    const input = {
      releases: [
        {
          name: '@atlaskit/badge',
          version: 'v1.0.0',
          commits: ['496287c'],
        },
      ],
      changeSets: [
        {
          summary: 'We fix few bugs in badge.',
          commit: '496287c',
          releases: [
            {
              name: '@atlaskit/badge',
              type: 'patch',
            },
          ],
        },
      ],
    };

    const output = generateMarkdownTemplate(input.releases[0], input);
    expect(output).toBe(`## v1.0.0
- [patch] We fix few bugs in badge. [496287c](496287c)`);
  });

  it('should generate template from a simple release object with release notes', () => {
    const input = {
      releases: [
        {
          name: '@atlaskit/badge',
          version: 'v1.0.0',
          commits: ['496287c'],
        },
      ],
      changeSets: [
        {
          summary: 'We fix few bugs in badge.',
          releaseNotes: 'doc.md',
          commit: '496287c',
          releases: [
            {
              name: '@atlaskit/badge',
              type: 'patch',
            },
          ],
        },
      ],
    };

    const output = generateMarkdownTemplate(input.releases[0], input);
    expect(output).toBe(`## v1.0.0
- [patch] We fix few bugs in badge. [496287c](496287c)
  - See [doc.md](doc.md) for more information`);
  });

  it('should generate template from a release object with multiple changeSets', () => {
    const input = {
      releases: [
        {
          name: '@atlaskit/badge',
          version: 'v1.0.0',
          commits: ['496287c', '898739d'],
        },
      ],
      changeSets: [
        {
          summary: 'We fix few bugs in badge.',
          releaseNotes: 'release.md',
          commit: '496287c',
          releases: [
            {
              name: '@atlaskit/badge',
              type: 'patch',
            },
          ],
        },
        {
          summary: 'We added in a new feature in badge.',
          releaseNotes: 'super.md',
          commit: '898739d',
          releases: [
            {
              name: '@atlaskit/badge',
              type: 'minor',
            },
          ],
        },
      ],
    };

    const output = generateMarkdownTemplate(input.releases[0], input);
    expect(output).toBe(`## v1.0.0
- [patch] We fix few bugs in badge. [496287c](496287c)
  - See [release.md](release.md) for more information
- [minor] We added in a new feature in badge. [898739d](898739d)
  - See [super.md](super.md) for more information`);
  });

  it('should generate template from a release with dependencies', () => {
    const input = {
      releases: [
        {
          name: '@atlaskit/badge',
          version: 'v1.0.0',
          commits: ['496287c'],
          dependencies: [],
        },
        {
          name: '@atlaskit/code',
          version: 'v1.0.1',
          commits: ['496287c'],
          dependencies: ['@atlaskit/badge'],
        },
      ],
      changeSets: [
        {
          summary: 'We fix few bugs in badge.',
          releaseNotes: 'release.md',
          commit: '496287c',
          releases: [
            {
              name: '@atlaskit/badge',
              type: 'patch',
            },
          ],
          dependents: [
            {
              name: '@atlaskit/code',
              type: 'minor',
              dependencies: ['@atlaskit/badge'],
            },
          ],
        },
      ],
    };

    const output1 = generateMarkdownTemplate(input.releases[0], input);
    expect(output1).toBe(`## v1.0.0
- [patch] We fix few bugs in badge. [496287c](496287c)
  - See [release.md](release.md) for more information`);

    const output2 = generateMarkdownTemplate(input.releases[1], input);
    expect(output2).toBe(`## v1.0.1
- [minor] Updated dependencies [496287c](496287c)
  - @atlaskit/badge@v1.0.0`);
  });
});
