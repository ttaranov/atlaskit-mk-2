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

    switch (state) {
      case processState.START: {
        if (twoChar !== '??') {
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
        // empty mark is treated as normal text
        if (buffer.length === 0) {
          return {
            type: 'text',
            text: '????',
            length: 4,
          };
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
