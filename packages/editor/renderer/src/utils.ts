import { Schema } from 'prosemirror-model';
import { defaultSchema, Transformer } from '@atlaskit/editor-common';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Node } from 'prosemirror-model';

export const bigEmojiHeight = 40;

function createEncoder<T>(parser: Transformer<T>, encoder: Transformer<any>) {
  return (value: T) => encoder.encode(parser.parse(value));
}
export type TransformerProvider<T> = (schema: Schema) => Transformer<T>;
export class ADFEncoder<T> {
  encode: (value: T) => any;

  constructor(createTransformerWithSchema: TransformerProvider<T>) {
    const transformer = createTransformerWithSchema(defaultSchema);
    this.encode = createEncoder(transformer, new JSONTransformer());
  }
}

export const getText = (node: Node): string => {
  return (
    node.text ||
    node.attrs.text ||
    node.attrs.shortName ||
    `[${node.type.name}]`
  );
};
