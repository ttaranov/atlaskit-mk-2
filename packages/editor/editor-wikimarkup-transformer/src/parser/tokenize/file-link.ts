import { Schema } from 'prosemirror-model';
import getMediaGroupNodeView from '../nodes/mediaGroup';
import { Token } from './';

// [^attachment.pdf]
const FILE_LINK_REGEXP = /^\[\^([\(\)\w. -]+)\]/;

export function fileLink(input: string, schema: Schema): Token {
  const match = input.match(FILE_LINK_REGEXP);

  if (!match) {
    return fallback(input);
  }

  const node = getMediaGroupNodeView(schema, match[1]);

  return {
    type: 'pmnode',
    nodes: [node],
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
