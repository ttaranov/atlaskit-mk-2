import { Node as PMNode, Schema } from 'prosemirror-model';
import { parseString } from './text';
import { normalizePMNodes } from './utils/normalize';

export default class AbstractTree {
  private schema: Schema;
  private wikiMarkup: string;

  constructor(schema: Schema, wikiMarkup: string) {
    this.schema = schema;
    this.wikiMarkup = wikiMarkup;
  }

  /**
   * Convert reduced macros tree into prosemirror model tree
   */
  getProseMirrorModel(): PMNode {
    const content = parseString(this.wikiMarkup, this.schema);

    return this.schema.nodes.doc.createChecked(
      {},
      normalizePMNodes(content, this.schema),
    );
  }
}
