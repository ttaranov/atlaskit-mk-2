import { defaultSchema, Transformer } from '@atlaskit/editor-common';

import { Node as PMNode } from 'prosemirror-model';

export class WikiMarkupTransformer implements Transformer<string> {
  encode(node: PMNode): string {
    throw new Error('Not implemented yet');
  }

  parse(wikiMarkup: string): PMNode {
    throw new Error('Not implemented yet');
  }
}
