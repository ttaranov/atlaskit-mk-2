import { Schema } from 'prosemirror-model';
import { Token } from './';
import { parseNewlineOnly } from './whitespace';

export function hardbreak(input: string, schema: Schema): Token {
  // Look for special hardbreak \\
  const firstTwoChar = input.substr(0, 2);
  if (firstTwoChar === '\\\\') {
    return {
      type: 'pmnode',
      nodes: [schema.nodes.hardBreak.createChecked()],
      length: 2,
    };
  }

  // Look for normal hardbreak \r, \n, \r\n
  const length = parseNewlineOnly(input);

  if (length === 0) {
    // not a valid hardbreak
    return {
      type: 'text',
      text: input.substr(0, 1),
      length: 1,
    };
  }

  return {
    type: 'pmnode',
    nodes: [schema.nodes.hardBreak.createChecked()],
    length,
  };
}
