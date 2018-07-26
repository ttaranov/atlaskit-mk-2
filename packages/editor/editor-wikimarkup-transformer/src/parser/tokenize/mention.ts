import { Schema } from 'prosemirror-model';
import { Token } from './';

// [~username]
const MENTION_REGEXP = /^\[~([\w]+?)\]/;

export function mention(input: string, schema: Schema): Token {
  const match = input.match(MENTION_REGEXP);

  if (!match) {
    return fallback();
  }

  const [, mentionText] = match;

  const mentionNode = schema.nodes.mention.createChecked({
    id: mentionText,
  });

  return {
    type: 'pmnode',
    nodes: [mentionNode],
    length: match[0].length,
  };
}

function fallback(): Token {
  return {
    type: 'text',
    text: '[~',
    length: 2,
  };
}
