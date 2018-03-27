import WikiMarkupTransformer from '../../src';

describe('JIRA wiki markup - Macros', () => {
  const testCases: [string, string][] = [
    [
      'should convert simple quotes into a top level node',
      '{quote}simple quote{quote}',
    ],
    [
      'should convert string with quote into paragraph and quote',
      'this is a string with a {quote}quote{quote}',
    ],
    [
      'should not process noformat contents',
      '{noformat}{code}code inside noformat{code}{noformat}',
    ],
    [
      'should not process code contents',
      '{code:xml}this is a {color:red}colored text{color}{noformat}{code}',
    ],
    [
      'should convert panels',
      '{panel:title=My Title|borderStyle=dashed}Panel with nested quote here{panel}',
    ],
    [
      'should convert multiple quotes containing string',
      'This is a {quote}quote1{quote}{quote}quote2{quote}',
    ],
    [
      'should split nodes if there is more than one level of depth',
      'This is a {quote}quote with a {panel}panel{panel} inside{quote}.',
    ],
    [
      'should support strings with a wrong order of macros',
      'This is a {panel:foo=bar} panel with a {quote}quote inside{panel} but it is broken{quote}',
    ],
    [
      'should convert string with heading in it',
      `
This is a string.
h1. Boom! this is a heading with *bold* text in it
      `,
    ],
    [
      'should collapse outer macros',
      '{panel:title=My Title|borderStyle=dashed}{quote}Panel with nested quote here{quote}{panel}.',
    ],
    [
      'should collapse and join outer macros',
      '{panel:title=My Title|borderStyle=dashed}This text is inside panel{quote}quote{panel}only quote{quote}',
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
