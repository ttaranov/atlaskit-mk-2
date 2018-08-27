import { Schema } from 'prosemirror-model';
import { parseString } from '../text';
import { Token, TokenType } from './';
import { parseNewlineOnly } from './whitespace';

const processState = {
  START: 0,
  BUFFER: 1,
  END: 2,
};

export function monospace(input: string, schema: Schema): Token {
  let index = 0;
  let state = processState.START;
  let buffer = '';

  /**
   * The following token types will be ignored in parsing
   * the content
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
  ];

  while (index < input.length) {
    const char = input.charAt(index);
    const twoChar = input.substr(index, 2);

    switch (state) {
      case processState.START: {
        if (twoChar !== '{{') {
          // this is not a valid monospace
          return fallback();
        }
        state = processState.BUFFER;
        index += 2;
        continue;
      }
      case processState.BUFFER: {
        // the linebreak would break the monospace
        const length = parseNewlineOnly(buffer);
        if (length) {
          return fallback();
        }
        if (twoChar === '}}') {
          state = processState.END;
          continue;
        } else {
          buffer += char;
        }
        break;
      }
      case processState.END: {
        // empty monospace is treated as normal text
        if (buffer.length === 0) {
          return {
            type: 'text',
            text: '{{}}',
            length: 4,
          };
        }

        const rawContent = parseString(buffer, schema, ignoreTokenTypes);
        const decoratedContent = rawContent.map(n => {
          const mark = schema.marks.code.create();
          if (n.type.name === 'text') {
            return n.mark([...n.marks, mark]);
          }
          return n;
        });

        return {
          type: 'pmnode',
          nodes: decoratedContent,
          length: buffer.length + 4,
        };
      }
      default:
    }
    index++;
  }
  return fallback();
}

function fallback(): Token {
  return {
    type: 'text',
    text: '{{',
    length: 2,
  };
}
