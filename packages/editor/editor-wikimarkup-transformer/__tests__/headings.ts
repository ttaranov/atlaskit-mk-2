import WikiMarkupTransformer from '../src';

describe('JIRA wiki markup - headings', () => {
  const testCases: [string, string][] = [
    [
      'should convert string with heading in it',
      `
This is a string.
h1. Boom! this is a heading with *bold* text in it
      `,
    ],
    [
      'should set specific style for heading level 1 inside macro',
      '{panel}h1. heading{panel}',
    ],
    [
      'should set specific style for heading level 2 inside macro',
      '{panel}h2. heading{panel}',
    ],
    [
      'should set specific style for heading level 3 inside macro',
      '{panel}h3. heading{panel}',
    ],
    [
      'should set specific style for heading level 4 inside macro',
      '{panel}h4. heading{panel}',
    ],
    [
      'should set specific style for heading level 5 inside macro',
      '{panel}h5. heading{panel}',
    ],
    [
      'should set specific style for heading level 6 inside macro',
      '{panel}h6. heading{panel}',
    ],
    ['should treat h7 as usual text inside macro', '{panel}h7. heading{panel}'],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
