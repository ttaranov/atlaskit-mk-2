// import { defaultSchema } from '@atlaskit/editor-common';
// import AbstractTree from '../../src/parser/abstract-tree';

describe('JIRA wiki markup - Abstract tree', () => {
  it('should reduce deep tree to a flat version', () => {
    // const markup = '{quote}{panel}quote with nested panel{panel}{quote}';
    // should reduce to {panel}quote with nested panel{panel}
  });

  it('should reduce deep tree to a flat version', () => {
    // const markup = '{quote}This is a quote with a {panel}nested panel{panel}{quote}';
    // should reduce to {quote}This is a quote with a {quote}{panel}nested panel{panel}
  });
});
