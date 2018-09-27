import { Schema } from 'prosemirror-model';
import { Token } from './';
import { parseNewlineOnly, parseWhitespaceAndNewLine } from './whitespace';

const processState = {
  START: 0,
  BUFFER: 1,
  END: 2,
};

export function monospace(input: string, schema: Schema): Token {
  let index = 0;
  let state = processState.START;
  let buffer = '';

  while (index < input.length) {
    const char = input.charAt(index);
    const twoChar = input.substr(index, 2);
    const thirdChar = input.charAt(index + 2);

    switch (state) {
      case processState.START: {
        if (twoChar !== '{{' || thirdChar === ' ') {
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
        index += 2;
        // empty monospace is treated as normal text
        if (buffer.length === 0) {
          return {
            type: 'text',
            text: '{{}}',
            length: 4,
          };
        }

        /**
         * If the closing symbol has an empty space before it,
         * it's not a valid formatter
         * If the closing symbol is not at the end of the line and
         * has not a following space, it's not a valid formatter
         */
        if (index < input.length) {
          const length = parseWhitespaceAndNewLine(input.substring(index));
          if (buffer.endsWith(' ') || length === 0) {
            return fallback();
          }
        }

        const codeMark = schema.marks.code.create();
        const textNode = schema.text(buffer, [codeMark]);

        return {
          type: 'pmnode',
          nodes: [textNode],
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
