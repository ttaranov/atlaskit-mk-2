import { defaultSchema } from '@atlaskit/editor-common';
import AbstractTree from '../../src/parser/abstract-tree';

describe('JIRA wiki markup - Abstract tree', () => {
  const testCases: [string, string][] = [
    ['simple strong wrapper string', '*Strong text*'],
    ['simple strong string', 'This is a string with a *strong* text'],
    [
      'string with a wrong order of effects',
      'This is a *strong ^string* with a ~^bla*~~',
    ],
  ];

  for (const [testCaseName, markup] of testCases) {
    it(`should match parsed structure for ${testCaseName}`, () => {
      const tree = new AbstractTree(defaultSchema, markup);

      console.log(JSON.stringify(tree.getTextIntervals(), null, 2));
    });
  }
});
