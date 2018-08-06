import { Schema } from 'prosemirror-model';
import { blockquoteMacro } from '../macro/blockQuote';
import { Token } from './';

// bq. sadfsdf
const HEADING_REGEXP = /^bq\.\s(.*)/;

export function blockquote(input: string, schema: Schema): Token {
  const match = input.match(HEADING_REGEXP);

  if (!match) {
    return fallback(input);
  }

  const [, rawContent] = match;
  const nodes = blockquoteMacro({}, rawContent, schema);

  return {
    type: 'pmnode',
    nodes,
    length: match[0].length,
  };
}

function fallback(input: string): Token {
  return {
    type: 'text',
    text: input.substr(0, 1),
    length: 1,
  };
}
