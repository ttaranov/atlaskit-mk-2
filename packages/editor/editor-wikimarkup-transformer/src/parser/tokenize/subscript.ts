import { Schema } from 'prosemirror-model';
import { parseString } from '../text';
import { Token, TokenType } from './';
import { parseNewlineOnly } from './whitespace';
import { hasAnyOfMarks } from '../utils/text';

const processState = {
  START: 0,
  BUFFER: 1,
  END: 2,
};

export function subscript(input: string, schema: Schema): Token {
  let index = 0;
  let state = processState.START;
  let buffer = '';

  /**
   * The following token types will be ignored in parsing
   * the content of a  mark
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
  ];

  while (index < input.length) {
    const char = input.charAt(index);

    switch (state) {
      case processState.START: {
        if (char !== '~') {
          // this is not a valid -mark
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
        // the linebreak would break the  marks
        const length = parseNewlineOnly(input.substring(index));
        if (length) {
          return fallback();
        }
        if (char === '~') {
          state = processState.END;
          continue;
        } else {
          buffer += char;
        }
        break;
      }
      case processState.END: {
        // empty  mark is treated as normal text
        if (buffer.length === 0) {
          return {
            type: 'text',
            text: '~~',
            length: 2,
          };
        }

        const rawContent = parseString(buffer, schema, ignoreTokenTypes);
        const decoratedContent = rawContent.map(n => {
          const mark = schema.marks.subsup.create({ type: 'sub' });
          // We don't want to mix `code` mark with others
          if (n.type.name === 'text' && !hasAnyOfMarks(n, ['sub', 'code'])) {
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
      default:
    }
    index++;
  }
  return fallback();
}

function fallback(): Token {
  return {
    type: 'text',
    text: '~',
    length: 1,
  };
}
