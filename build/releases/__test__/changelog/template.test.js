const { generateMarkdownTemplate } = require('../../changelog/template');

describe('template', () => {
  it('should generate template from a simple release object', () => {
    const input = {
      name: '@atlaskit/badge',
      version: 'v1.0.0',
      changeSets: [
        {
          summary: 'We fix few bugs in badge.',
          commit: '496287c',
          releases: {
            '@atlaskit/badge': 'patch',
          },
        },
      ],
    };

    const output = generateMarkdownTemplate(input);
    expect(output).toBe(`## v1.0.0
- [patch] We fix few bugs in badge. [496287c](496287c)`);
  });

  it('should generate template from a release object with doc provided', () => {
    const input = {
      name: '@atlaskit/badge',
      version: 'v1.0.0',
      changeSets: [
        {
          summary: 'We fix few bugs in badge.',
          doc: 'release.md',
          commit: '496287c',
          releases: {
            '@atlaskit/badge': 'patch',
          },
        },
      ],
    };

    const output = generateMarkdownTemplate(input);
    expect(output).toBe(`## v1.0.0
- [patch] We fix few bugs in badge. [496287c](496287c)
  - See [release.md](release.md) for more information`);
  });

  it('should generate template from a release object with multiple changeSets', () => {
    const input = {
      name: '@atlaskit/badge',
      version: 'v1.0.0',
      changeSets: [
        {
          summary: 'We fix few bugs in badge.',
          doc: 'release.md',
          commit: '496287c',
          releases: {
            '@atlaskit/badge': 'patch',
          },
        },
        {
          summary: 'We added in a new feature in badge.',
          doc: 'super.md',
          commit: '898739d',
          releases: {
            '@atlaskit/badge': 'minor',
          },
        },
      ],
    };

    const output = generateMarkdownTemplate(input);
    expect(output).toBe(`## v1.0.0
- [patch] We fix few bugs in badge. [496287c](496287c)
  - See [release.md](release.md) for more information
- [minor] We added in a new feature in badge. [898739d](898739d)
  - See [super.md](super.md) for more information`);
  });

  it('should generate template from a release with dependent', () => {
    const input = {
      name: '@atlaskit/badge',
      version: 'v1.0.0',
      changeSets: [
        {
          summary: 'We fix few bugs in badge.',
          doc: 'release.md',
          commit: '496287c',
          releases: {
            '@atlaskit/badge': 'patch',
          },
        },
      ],
      dependent: {
        name: '@atlaskit/badge',
        version: 'v1.0.0',
        dependencies: [
          {
            name: '@atlaskit/code',
            version: '0.9.0',
            commits: ['63c5ea9', '63uyea9'],
          },
        ],
      },
    };

    const output = generateMarkdownTemplate(input);
    expect(output).toBe(`## v1.0.0
- [patch] We fix few bugs in badge. [496287c](496287c)
  - See [release.md](release.md) for more information
- [dependencies] Updated dependencies
  - @atlaskit/code@0.9.0 [63c5ea9](63c5ea9), [63uyea9](63uyea9)`);
  });
});
