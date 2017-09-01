const { generateMarkdownTemplate } = require('../../changelog/template');

describe('template', () => {
  it('should generate template from a version commit object', () => {
    const input = {
      version: 'v1.0.0',
      releases: [
        {
          versionType: 'patch',
          summary: 'We fix few bugs in badge.',
          doc: 'release.md',
        },
        {
          versionType: 'dependent',
          summary: 'A super nice feature in lozenge.',
          doc: 'release.md',
        },
      ],
    };

    const output = generateMarkdownTemplate(input);
    expect(output).toBe(`
## v1.0.0
- [patch] We fix few bugs in badge.
  - See [release.md](release.md) for more information
- [dependent] A super nice feature in lozenge.
  - See [release.md](release.md) for more information
`);
  });

  it('should be ablt to generate template without doc given', () => {
    const input = {
      version: 'v1.0.0',
      releases: [
        {
          versionType: 'patch',
          summary: 'We fix few bugs in badge.',
        },
        {
          versionType: 'dependent',
          summary: 'A super nice feature in lozenge.',
        },
      ],
    };

    const output = generateMarkdownTemplate(input);
    expect(output).toBe(`
## v1.0.0
- [patch] We fix few bugs in badge.
- [dependent] A super nice feature in lozenge.
`);
  });
});
