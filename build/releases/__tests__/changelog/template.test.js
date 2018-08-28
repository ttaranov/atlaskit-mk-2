const outdent = require('outdent');
const { generateMarkdownTemplate } = require('../../changelog/template');

describe('template', () => {
  it('should generate template from a simple release object', () => {
    const input = {
      releases: [
        {
          name: '@atlaskit/badge',
          version: '1.0.0',
          commits: ['496287c'],
        },
      ],
      changesets: [
        {
          summary: 'We fix few bugs in badge.',
          commit: '496287c',
          releases: [
            {
              name: '@atlaskit/badge',
              type: 'patch',
            },
          ],
          dependents: [],
        },
      ],
    };

    const output = generateMarkdownTemplate(input.releases[0], input);
    const expectedOutput = outdent`
      ## 1.0.0
      - [patch] We fix few bugs in badge. [496287c](496287c)
    `;
    expect(output).toBe(expectedOutput);
  });

  it('should generate template from a simple release object with release notes', () => {
    const input = {
      releases: [
        {
          name: '@atlaskit/badge',
          version: '1.0.0',
          commits: ['496287c'],
        },
      ],
      changesets: [
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
          dependents: [],
        },
      ],
    };

    const output = generateMarkdownTemplate(input.releases[0], input);
    const expectedOutput = outdent`
      ## 1.0.0
      - [patch] We fix few bugs in badge. [496287c](496287c)
        - See [doc.md](doc.md) for more information
    `;
    expect(output).toBe(expectedOutput);
  });

  it('should generate template from a release object with multiple changesets', () => {
    const input = {
      releases: [
        {
          name: '@atlaskit/badge',
          version: '1.0.0',
          commits: ['496287c', '898739d'],
        },
      ],
      changesets: [
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
          dependents: [],
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
          dependents: [],
        },
      ],
    };

    const output = generateMarkdownTemplate(input.releases[0], input);
    const expectedOutput = outdent`
      ## 1.0.0
      - [patch] We fix few bugs in badge. [496287c](496287c)
        - See [release.md](release.md) for more information
      - [minor] We added in a new feature in badge. [898739d](898739d)
        - See [super.md](super.md) for more information
    `;
    expect(output).toBe(expectedOutput);
  });

  it('should generate template from a release with dependencies', () => {
    const input = {
      releases: [
        {
          name: '@atlaskit/badge',
          version: '1.0.0',
          commits: ['496287c'],
        },
        {
          name: '@atlaskit/code',
          version: '1.0.1',
          commits: ['496287c'],
        },
      ],
      changesets: [
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
    const expectedOutput1 = outdent`
      ## 1.0.0
      - [patch] We fix few bugs in badge. [496287c](496287c)
        - See [release.md](release.md) for more information
    `;
    expect(output1).toBe(expectedOutput1);

    const output2 = generateMarkdownTemplate(input.releases[1], input);
    const expectedOutput2 = outdent`
      ## 1.0.1
      - [minor] Updated dependencies [496287c](496287c)
        - @atlaskit/badge@1.0.0`;
    expect(output2).toBe(expectedOutput2);
  });

  it('should generate full urls when given a repo url', () => {
    const input = {
      releases: [
        {
          name: '@atlaskit/badge',
          version: '1.0.0',
          commits: ['496287c'],
        },
      ],
      changesets: [
        {
          summary: 'We fix few bugs in badge.',
          commit: '496287c',
          releases: [
            {
              name: '@atlaskit/badge',
              type: 'patch',
            },
          ],
          dependents: [],
        },
      ],
    };

    const output = generateMarkdownTemplate(
      input.releases[0],
      input,
      'https://some-website.com',
    );
    const expectedOutput = outdent`
      ## 1.0.0
      - [patch] We fix few bugs in badge. [496287c](https://some-website.com/496287c)
    `;
    expect(output).toEqual(expectedOutput);
  });

  it('should correctly display multiple dependent bumps for one package', () => {
    const input = {
      releases: [
        { name: '@atlaskit/badge', version: '1.1.0', commits: ['496287c'] },
        { name: '@atlaskit/tag', version: '1.0.1', commits: ['496287c'] },
        { name: '@atlaskit/button', version: '1.0.1', commits: ['496287c'] },
      ],
      changesets: [
        {
          summary: 'We fix few bugs in badge.',
          commit: '496287c',
          releases: [
            {
              name: '@atlaskit/badge',
              type: 'patch',
            },
          ],
          dependents: [
            {
              name: '@atlaskit/badge',
              type: 'minor',
              dependencies: ['@atlaskit/button', '@atlaskit/tag'],
            },
          ],
        },
        {
          summary: 'We fix few bugs in button.',
          commit: '999999',
          releases: [
            {
              name: '@atlaskit/button',
              type: 'patch',
            },
          ],
          dependents: [
            {
              name: '@atlaskit/badge',
              type: 'patch',
              dependencies: ['@atlaskit/button', '@atlaskit/tag'],
            },
          ],
        },
      ],
    };

    const output = generateMarkdownTemplate(
      input.releases[0],
      input,
      'https://some-website.com',
    );
    const expectedOutput = outdent`
      ## 1.1.0
      - [patch] We fix few bugs in badge. [496287c](https://some-website.com/496287c)
      - [minor] Updated dependencies [496287c](https://some-website.com/496287c)
      - [patch] Updated dependencies [999999](https://some-website.com/999999)
        - @atlaskit/button@1.0.1
        - @atlaskit/tag@1.0.1
    `;
    expect(output).toEqual(expectedOutput);
  });
});
