import WikiMarkupTransformer from '../src';

describe('JIRA wiki markup - Misc', () => {
  const testCases: [string, string][] = [
    [
      'should find emojis in text',
      'this is a string with :) emojis in it (*) tada',
    ],
    [
      'should find emojis in text with marks',
      'this is a string ~with :) emojis~ in it (*) tada',
    ],
    [
      'should find emojis and mentions in text',
      'this is a string with :) emojis and [~username] mentions',
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
