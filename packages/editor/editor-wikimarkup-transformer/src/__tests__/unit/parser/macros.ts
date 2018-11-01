import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Macros', () => {
  const testCases: Array<[string, string]> = [
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
    ['should process code with title', '{code:title=title}const i = 0;{code}'],
    [
      'should convert panels',
      '{panel:title=My Title|borderStyle=dashed}Panel with nested quote here{panel}',
    ],
    [
      'should map panel bgColor in colorName to panel type',
      '{panel:title=My Title|bgColor=red}Panel with nested quote here{panel}',
    ],
    [
      'should map panel bgColor in hex value to panel type',
      '{panel:title=My Title|bgColor=#00FF00}Panel with nested quote here{panel}',
    ],
    [
      'should map panel bgColor in hex value to panel type',
      '{panel:title=My Title|bgColor=#rgb(0, 255, 255)}Panel with nested quote here{panel}',
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
      'should collapse outer macros',
      '{panel:title=My Title|borderStyle=dashed}{quote}Panel with nested quote here{quote}{panel}.',
    ],
    [
      'should collapse and join outer macros',
      '{panel:title=My Title|borderStyle=dashed}This text is inside panel{quote}quote{panel}only quote{quote}',
    ],
    [
      'should lift rule node when it is inside macro',
      `{panel}this is a text
----
this is a text as well{panel}`,
    ],
    [
      'should render rule node if it is on the top level',
      `this is a text
----
this is a text as well`,
    ],
    [
      'should transform h1 to Bold and Uppercase under blockquote',
      '{quote}h1. header one{quote}',
    ],
    [
      'should transform h2 to Bold and Italic under blockquote',
      '{quote}h2. header two{quote}',
    ],
    [
      'should transform h3 to Bold under blockquote',
      '{quote}h3. header three{quote}',
    ],
    [
      'should transform h4 to Bold and Gray under blockquote',
      '{quote}h4. header four{quote}',
    ],
    [
      'should transform h5 to Italic and Gray under blockquote',
      '{quote}h5. header five{quote}',
    ],
    [
      'should transform h6 to Gray under blockquote',
      '{quote}h6. header six{quote}',
    ],
    [
      'should lift list in a blockquote',
      `{quote}something
* list item
{quote}`,
    ],
    [
      'should render {anchor} as empty string',
      `You cannot see this {anchor:here}`,
    ],
    [
      'should render {loremipsum} as plain text',
      `This is plain text {loremipsum}`,
    ],
    [
      'should render macro likes {macrolike} as plain text',
      `This is plain text {macrolike}`,
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
