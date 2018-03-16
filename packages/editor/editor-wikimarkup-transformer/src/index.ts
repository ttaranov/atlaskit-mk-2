import { defaultSchema, Transformer } from '@atlaskit/editor-common';
import { Node as PMNode, Schema } from 'prosemirror-model';

import { calcIntervals, scanMacro } from './parser/macro';
import { combineAll, intervalsToPM } from './parser/text';

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
    const macro = scanMacro(wikiMarkup);
    const intervals = calcIntervals(wikiMarkup, macro);
    const intervalsWithPMNodes = intervalsToPM(wikiMarkup, intervals);

    return combineAll(this.schema, macro, intervalsWithPMNodes);
  }
}
