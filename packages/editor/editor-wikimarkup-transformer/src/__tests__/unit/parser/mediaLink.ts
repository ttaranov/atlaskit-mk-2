import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - mediaLink', () => {
  const testCases: Array<[string, string]> = [
    ['should create a mediaLink in mediaGroup node', '[^test.txt]'],
    [
      'should not include mediaLink inside a list',
      '* some random list [^not-in-list.txt]',
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
