import { defaultSchema } from '@atlaskit/editor-common';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Node as PMNode } from 'prosemirror-model';
import AbstractTree from '../../src/parser/abstract-tree';

const showADF = (doc: PMNode) => {
  const transformer = new JSONTransformer();
  const adf = transformer.encode(doc);

  // tslint:disable-next-line:no-console
  console.log(JSON.stringify(adf, null, 2));
};

describe('JIRA wiki markup - Abstract tree', () => {
  it('should build a prosemirror model for wiki markup', () => {
    const markup = '{quote}simple quote{quote}';
    const tree = new AbstractTree(defaultSchema, markup);
    const pmNode = tree.getProseMirrorModel();

    showADF(pmNode);
  });
});
