import { isSafeUrl } from '@atlaskit/editor-common';
import { Schema } from 'prosemirror-model';
import { Token } from './';

// https://www.atlassian.com
export const LINK_TEXT_REGEXP = /^(https?|irc):\/\/[\w.?\/\\#-=]+/;

export function linkText(input: string, schema: Schema): Token {
  const match = input.match(LINK_TEXT_REGEXP);

  if (!match) {
    return fallback(input);
  }

  const textRepresentation = match[0];
  const url = match[0];

  if (!isSafeUrl(url)) {
    return fallback(input);
  }

  const mark = schema.marks.link.create({
    href: url,
  });
  const textNode = schema.text(textRepresentation, [mark]);

  return {
    type: 'pmnode',
    nodes: [textNode],
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
