import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Tables', () => {
  const testCases: Array<[string, string]> = [
    [
      'should find and convert tables',
      `||heading 1||heading 2||heading 3||
|col A1|col A2|col A3|
|col B1|col B2|h1. heading|`,
    ],
    [
      'should find text nodes at the end of the table',
      `|| foo || bar
| baz | multiline
yep
still going
yeah good luck closing this`,
    ],
    ['should be able to parse macros in table', `|{panel}123{panel}|`],
    ['should not render trailing space into a new cell', '|cell 1|cell 2|   '],
    [
      'should covet to same cell type for cells on the same row',
      '||Fixed? |No ||',
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
