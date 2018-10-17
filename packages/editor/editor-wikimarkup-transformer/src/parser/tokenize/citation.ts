import { Schema } from 'prosemirror-model';
import { Token } from './';
import { parseNewlineOnly } from './whitespace';

const processState = {
  START: 0,
  BUFFER: 1,
  END: 2,
};

export function citation(input: string, schema: Schema): Token {
  let index = 0;
  let state = processState.START;
  let buffer = '';

  while (index < input.length) {
    const char = input.charAt(index);
    const twoChar = input.substr(index, 2);
    const thirdChar = input.charAt(index + 2);

    switch (state) {
      case processState.START: {
        if (twoChar !== '??' || thirdChar === ' ') {
          // this is not a valid mark
          return fallback();
        }
        state = processState.BUFFER;
        index += 2;
        continue;
      }
      case processState.BUFFER: {
        // the linebreak would break the mark
        const length = parseNewlineOnly(input.substring(index));
        if (length) {
          return fallback();
        }
        if (twoChar === '??') {
          state = processState.END;
          continue;
        } else {
          buffer += char;
        }
        break;
      }
      case processState.END: {
        index += 2;
        // empty mark is treated as normal text
        if (buffer.length === 0) {
          return {
            type: 'text',
            text: '????',
            length: 4,
          };
        }

        /**
         * If the closing symbol is followed by a alphanumeric, it's
         * not a valid formatter
         */
        if (index < input.length) {
          const charAfterEnd = input.charAt(index);
          if (/[a-zA-Z0-9]|[^\u0000-\u007F]/.test(charAfterEnd)) {
            return fallback();
          }
        }
        /**
         * If the closing symbol has an empty space before it,
         * it's not a valid formatter
         */
        if (buffer.endsWith(' ')) {
          return fallback();
        }

        const mark = schema.marks.em.create();
        const textNode = schema.text(`-- ${buffer}`, [mark]);

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
    text: '??',
    length: 2,
  };
}
