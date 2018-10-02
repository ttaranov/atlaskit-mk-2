import { defaultSchema, Transformer } from '@atlaskit/editor-common';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { encode } from './encoder';
import AbstractTree from './parser/abstract-tree';
import { TokenErrCallback } from './parser/tokenize';

export class WikiMarkupTransformer implements Transformer<string> {
  private schema: Schema;

  constructor(schema: Schema = defaultSchema) {
    this.schema = schema;
  }

  encode(node: PMNode): string {
    return encode(node);
  }

  parse(wikiMarkup: string, tokenErrCallback?: TokenErrCallback): PMNode {
    const tree = new AbstractTree(this.schema, wikiMarkup);
    return tree.getProseMirrorModel(tokenErrCallback);
  }
}

export default WikiMarkupTransformer;
