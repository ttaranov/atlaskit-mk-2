import { Schema } from 'prosemirror-model';
import { getMediaGroupNodeView } from '../nodes/media';
import { Token } from './';

// [^attachment.ext]
const MEDIA_LINK_REGEXP = /^(?:\[\^)(.+)\]/;

export function mediaLink(input: string, schema: Schema): Token {
  const match = input.match(MEDIA_LINK_REGEXP);

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
