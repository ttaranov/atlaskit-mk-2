import { Schema } from 'prosemirror-model';
import getMediaSingleNodeView from '../nodes/mediaSingle';
import { Token } from './';
import { parseAttrs } from '../utils/attrs';

// [!image.jpg!|https://www.atlassian.com]
const MEDIA_REGEXP = /^\!([\(\)\w. -]+)(\|[\w=,. ]*)?\!/;

export function media(input: string, schema: Schema): Token {
  const match = input.match(MEDIA_REGEXP);

  if (!match) {
    return fallback(input);
  }

  const rawAttrs = match[2] ? match[2].slice(1) : '';

  const node = getMediaSingleNodeView(
    schema,
    match[1],
    parseAttrs(rawAttrs, ','),
  );

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
