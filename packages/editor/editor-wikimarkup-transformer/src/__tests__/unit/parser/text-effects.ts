import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Text effects', () => {
  const testCases: Array<[string, string]> = [
    [
      'should find strong marks in the text',
      'This is a string with a *strong* text',
    ],
    [
      'should divide marks intervals into combination of marks',
      'This is a *string with a {color:red}bold red* text{color}.',
    ],
    [
      'should default unknown color to black #000000',
      'This is a unknown {color:nimabi}color{color}',
    ],
    ['should find monospace text', 'This is a string with {{monospaced text}}'],
    [
      'should not search for monospace text inside code macro',
      'This is a string with {code}mono {{space}} text{code}',
    ],
    ['should process superscript', 'This is a ^superscript^'],
    ['should process subscript', 'This is a ~subscript~'],
    ['should process emphasis', 'This is a _emphasis_'],
    ['should process citation', 'This is a ??citation??'],
    ['should process deleted', 'This is a -deleted-'],
    ['should process inserted', 'This is a +inserted+'],
    [
      'should process string with a wrong order of effects',
      'This is a *strong ^string* with a ~^ bla*~~',
    ],
    [
      'should convert double baskslash to a hardBreak node',
      'this is a text with a\\\\new line in it',
    ],
    [
      'should not fail while applying marks to a string containing double backslash',
      'this is a text *with a\\\\new* line in it',
    ],
    [
      'should not apply marks on separate lines',
      `this is a line with an *asterisk
another one is here and it should* not be applied`,
    ],
    [
      "should use code mark first if it's the inner mark",
      'This is a *bold {{monospace}} thingy*',
    ],
    [
      'should not replace marks in the middle of the word',
      `https://app.datadoghq.com/screen/220506/product-fabric-content-service?tv_mode=true

https://app.datadoghq.com/screen/282018/product-fabric-adf-service?tv_mode=true#close`,
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
