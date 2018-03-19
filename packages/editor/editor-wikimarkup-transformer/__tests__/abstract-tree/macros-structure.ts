import { defaultSchema } from '@atlaskit/editor-common';
import AbstractTree from '../../src/parser/abstract-tree';

describe('JIRA wiki markup - Abstract tree', () => {
  const testCases: [string, string][] = [
    ['simple quote wrapper string', '{quote}simple quote{quote}'],
    ['simple quote string', 'This is a {quote}simple quote{quote}'],
    [
      'multiple quotes containing string',
      'This is a {quote}quote1{quote}{quote}quote2{quote}',
    ],
    ['simple code containing string', 'This is a {code:xml}<xml_code/>{code}'],
    [
      'noformat example',
      'This is a {noformat}no format thing with {code}inside{code}{noformat}',
    ],
    [
      'quote example with a panel inside',
      'This is a {quote}quote with a {panel}panel{panel} inside{quote}.',
    ],
    [
      'panel with attributes and a nested quote',
      '{panel:title=My Title|borderStyle=dashed}{quote}Panel with nested quote here{quote}{panel}.',
    ],
  ];

  for (const [testCaseName, markup] of testCases) {
    it(`should match parsed structure for ${testCaseName}`, () => {
      const tree = new AbstractTree(defaultSchema, markup);
      // console.log(JSON.stringify(tree.getMacrosStructure(), null, 2));
      expect(tree.getMacrosStructure()).toMatchSnapshot();
    });
  }
});
