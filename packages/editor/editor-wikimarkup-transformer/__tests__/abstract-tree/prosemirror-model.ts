import { defaultSchema } from '@atlaskit/editor-common';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Node as PMNode } from 'prosemirror-model';
import AbstractTree from '../../src/parser/abstract-tree';

// @ts-ignore
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

    expect(pmNode).toMatchSnapshot();
  });

  it('should build a prosemirror model for wiki markup', () => {
    const markup = '{noformat}{code}code inside noformat{code}{noformat}';
    const tree = new AbstractTree(defaultSchema, markup);
    const pmNode = tree.getProseMirrorModel();

    expect(pmNode).toMatchSnapshot();
  });

  it('should build a prosemirror model for wiki markup', () => {
    const markup = '{code:xml}{noformat}noformat{noformat}{code}';
    const tree = new AbstractTree(defaultSchema, markup);
    const pmNode = tree.getProseMirrorModel();

    expect(pmNode).toMatchSnapshot();
  });

  it('should build a prosemirror model for wiki markup', () => {
    const markup =
      '{panel:title=My Title|borderStyle=dashed}{quote}Panel with nested quote here{quote}{panel}.';
    const tree = new AbstractTree(defaultSchema, markup);
    const pmNode = tree.getProseMirrorModel();

    expect(pmNode).toMatchSnapshot();
  });
});
