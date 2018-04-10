import { defaultSchema, Transformer } from '@atlaskit/editor-common';
import { Node as PMNode, Schema } from 'prosemirror-model';
import AbstractTree from './parser/abstract-tree';

export class WikiMarkupTransformer implements Transformer<string> {
  private schema: Schema;

  constructor(schema: Schema = defaultSchema) {
    this.schema = schema;
  }

  encode(node: PMNode): string {
    return 'bq. some texts here';
    // throw new Error('Not implemented yet');
  }

  parse(wikiMarkup: string): PMNode {
    const tree = new AbstractTree(this.schema, wikiMarkup);
    return tree.getProseMirrorModel();
  }
}

export default WikiMarkupTransformer;
