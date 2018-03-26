import { defaultSchema } from '@atlaskit/editor-common';
import AbstractTree from '../../src/parser/abstract-tree';
import WikiMarkupTransformer from '../../src';

describe('JIRA wiki markup - Abstract tree', () => {
  const testCases: [string, string][] = [
    // ['simple strong wrapper string', '*Strong text*'],
    // ['simple strong string', 'This is a string with a *strong* text'],
    // [
    //   'colourful strong text',
    //   'This is a *string with a {color:red}bold red* text{color}',
    // ],
    // ['monospace text', 'This is a string with {{monospaced text}}'],
    // [
    //   'monospace containing colourful text',
    //   'This is a string with {{monospaced {color:red}red{color} text}}',
    // ],
    // [
    //   'string with a wrong order of effects',
    //   'This is a *strong ^string* with a ~^bla*~~',
    // ],
  ];

  // for (const [testCaseName, markup] of testCases) {
  //   it(`should match parsed structure for ${testCaseName}`, () => {
  //     const tree = new AbstractTree(defaultSchema, markup);

  //     console.log(JSON.stringify(tree.getTextIntervals(), null, 2));
  //   });
  // }

  it('should convert double baskslash to a hardBreak node', () => {
    const markup = 'this is a text with a\\\\new line in it';
    const transformer = new WikiMarkupTransformer();

    expect(transformer.parse(markup)).toMatchSnapshot();
  });
});
