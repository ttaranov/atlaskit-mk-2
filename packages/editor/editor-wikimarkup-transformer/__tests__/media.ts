import WikiMarkupTransformer from '../src';

describe('JIRA wiki markup - Images and attachments', () => {
  const testCases: [string, string][] = [
    ['should find images in the text', '!image.png!'],
    ['should find attachments in the text', '!file.txt!'],
    ['should find absolute URL images', '!http://www.host.com/image.gif!'],
    [
      'should find attachments with attributes',
      '!quicktime.mov|width=300,height=400!',
    ],
    [
      'should find attachments in multiline string',
      `this is a line of text
!image.gif|align=right, vspace=4!
yep`,
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
