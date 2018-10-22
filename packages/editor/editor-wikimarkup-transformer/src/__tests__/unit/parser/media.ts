import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Images and attachments', () => {
  const testCases: Array<[string, string]> = [
    ['should find images in the text', '!image.png!'],
    [
      'should find absolute URL images and convert it to external media item',
      '!http://www.host.com/image.gif!',
    ],
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
    [
      'should find images in a multiline string with return symbols',
      '!Kapture 2018-04-04 at 16.36.13.gif!\r\n\r\nFoo',
    ],
    [
      '[CS-216] should parse media filename with "(" and ")"',
      '!Screen Shot (9db1eca8-8257-4763-92fb-e6417f9e34c9).jpeg|thumbnail!',
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
