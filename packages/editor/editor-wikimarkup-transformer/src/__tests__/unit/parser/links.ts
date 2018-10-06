import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Links', () => {
  const testCases: Array<[string, string]> = [
    [
      'should convert simple links to link marks',
      'This is a [https://www.atlassian.com] link',
    ],
    [
      'should convert links with text to link marks',
      'This is an [Atlassian|https://www.atlassian.com] link',
    ],
    [
      'should convert mailto: links to link marks + remove mailto: prefix',
      'This is a [mailto:legendaryservice@atlassian.com] link',
    ],
    [
      'should ignore file links',
      'This is a local file [file:///c:/temp/foo.txt] link',
    ],
    ['should ignore anchor-links starting with #', 'This is an [#anchor] link'],
    ['should ignore anchors', 'Anchor {anchor:anchorname} here'],
    [
      'should convert links with port to link marks',
      'Link with port [http://localhost:8080] here',
    ],
    [
      'should convert normal url text to link marks',
      'Hey, checkout atlassian=http://www.atlassian.com',
    ],
    [
      'should convert url text inside <> to link marks',
      'Hey, this is amazing <https://www.atlassian.com>',
    ],
    [
      'should convert IRC address text',
      'An IRC address: irc://atlassian.com/confluence',
    ],
    [
      'should ignore invalid protocal',
      'An invalid URL: invalid://nowhere.com/hello',
    ],
    [
      'should create Media Image and Link from linkable-image',
      'This is a linkable image [!image.jpg!|https://www.atlassian.com]',
    ],
    [
      '[CS-240] should know where to end the link',
      `[Link Title|http://www.google.com] boy I hope this doesn't go all the way to here] that would be bad.`,
    ],
    [
      '[CS-385] should link text in link format',
      `[https://splunk.paas-inf.net/en-GB/app/search/search?earliest=\-1d&latest=now|https://www.google.com]`,
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    fit(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
