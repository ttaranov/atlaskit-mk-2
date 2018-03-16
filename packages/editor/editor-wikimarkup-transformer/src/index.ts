import { Transformer } from '@atlaskit/editor-common';
import { Node as PMNode, Schema } from 'prosemirror-model';

export class WikiMarkupTransformer implements Transformer<string> {
  private schema: Schema;

  constructor(schema: Schema) {
    this.schema = schema;
  }

  encode(node: PMNode): string {
    return 'bq. some texts here';
    // throw new Error('Not implemented yet');
  }

  parse(wikiMarkup: string): PMNode {
    const text = this.schema.text('some texts here');
    const paragraph = this.schema.nodes.paragraph.create({}, text);
    const blockquote = this.schema.nodes.blockquote!.createChecked(
      {},
      paragraph,
    );
    return this.schema.nodes.doc.createChecked({}, blockquote);
    // throw new Error('Not implemented yet');
  }
}
