import { Schema } from 'prosemirror-model';
import { parseString } from '../text';
import { Token, TokenType } from './';
import { macro } from './macro';
import { parseNewlineOnly } from './whitespace';

const processState = {
  START: 0,
  BUFFER: 1,
  END: 2,
  INLINE_MACRO: 3,
};

export function strong(input: string, schema: Schema): Token {
  let index = 0;
  let state = processState.START;
  let buffer = '';

  /**
   * The following token types will be ignored in parsing
   * the content of a strong mark
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
        if (char !== '*') {
          // this is not a valid strong-mark
          return {
            type: 'text',
            text: char,
            length: 1,
          };
        }
        state = processState.BUFFER;
        break;
      }
      case processState.BUFFER: {
        // the linebreak would break the strong marks
        const length = parseNewlineOnly(input.substring(index));
        if (length) {
          return {
            type: 'text',
            text: '*',
            length: 1,
          };
        }
        if (char === '*') {
          state = processState.END;
          continue;
        } else if (twoChar === '{{') {
          // this is a monospace
          buffer += twoChar;
          index += 2;
          continue;
        } else if (char === '{') {
          state = processState.INLINE_MACRO;
          continue;
        } else {
          buffer += char;
        }
        break;
      }
      case processState.END: {
        // empty strong mark is treated as normal text
        if (buffer.length === 0) {
          return {
            type: 'text',
            text: '**',
            length: 2,
          };
        }

        const rawContent = parseString(buffer, schema, ignoreTokenTypes);
        const decoratedContent = rawContent.map(n => {
          const mark = schema.marks.strong.create();
          if (n.type.name === 'text') {
            return n.mark([...n.marks, mark]);
          }
          return n;
        });
        return {
          type: 'pmnode',
          nodes: decoratedContent,
          length: buffer.length + 2,
        };
      }
      case processState.INLINE_MACRO: {
        const token = macro(input.substr(index), schema);
        if (token.type === 'text') {
          buffer += token.text;
          index += token.length;
          state = processState.BUFFER;
          continue;
        } else {
          // No macro are accepted in strong text-effect
          return fallback();
        }
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
    text: '*',
    length: 1,
  };
}
