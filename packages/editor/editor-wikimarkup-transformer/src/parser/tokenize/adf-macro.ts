import { Schema } from 'prosemirror-model';
import { Token, TokenErrCallback } from '.';
import { commonMacro } from './common-macro';

export function adfMacro(
  input: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token {
  return commonMacro(input, schema, {
    opening: /^\{adf(?::([^\{\n\}]*))?\}/,
    closing: /\{adf\}/,
    rawContentProcessor,
    tokenErrCallback,
  });
}

const rawContentProcessor = (
  rawAttrs: string,
  rawContent: string,
  length: number,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token => {
  const json = JSON.parse(rawContent);
  const node = schema.nodeFromJSON(json);

  return {
    type: 'pmnode',
    nodes: [node],
    length,
  };
};
