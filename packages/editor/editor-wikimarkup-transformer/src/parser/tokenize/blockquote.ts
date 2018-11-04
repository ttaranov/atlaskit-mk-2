import { Schema } from 'prosemirror-model';
import { rawContentProcessor } from './quote-macro';
import { Token, TokenErrCallback } from './';

// bq. sadfsdf
const BLOCKQUOTE_REGEXP = /^bq\.\s(.*)/;

export function blockquote(
  input: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token {
  const match = input.match(BLOCKQUOTE_REGEXP);

  if (!match) {
    return fallback(input);
  }

  const [, rawContent] = match;
  return rawContentProcessor(
    '',
    rawContent,
    match[0].length,
    schema,
    tokenErrCallback,
  );
}

function fallback(input: string): Token {
  return {
    type: 'text',
    text: input.substr(0, 1),
    length: 1,
  };
}
