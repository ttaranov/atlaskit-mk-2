import { Schema } from 'prosemirror-model';
import getMediaNodeView from '../nodes/media';
import { Token } from './';

// [!image.jpg!|https://www.atlassian.com]
const ATTACHMENT_REGEXP = /^\!([\(\)\w. -]+)\|?[\w=,. ]*\!/;

export function attachment(input: string, schema: Schema): Token {
  const match = input.match(ATTACHMENT_REGEXP);

  if (!match) {
    return fallback(input);
  }

  const node = getMediaNodeView(schema, match[1]);

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
