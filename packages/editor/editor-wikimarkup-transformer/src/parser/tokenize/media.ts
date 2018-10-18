import { Schema } from 'prosemirror-model';
import getMediaSingleNodeView from '../nodes/mediaSingle';
import { Token } from './';
import { parseAttrs } from '../utils/attrs';
import { parseNewlineOnly } from './whitespace';

const processState = {
  START: 0,
  BUFFER: 1,
  END: 2,
};

export function media(input: string, schema: Schema): Token {
  let index = 0;
  let state = processState.START;
  let buffer = '';

  while (index < input.length) {
    const char = input.charAt(index);
    const secChar = input.charAt(index + 1);

    switch (state) {
      case processState.START: {
        if (char !== '!' || secChar === ' ') {
          // this is not a valid media item
          return fallback(input);
        }
        state = processState.BUFFER;
        break;
      }
      case processState.BUFFER: {
        // the linebreak would break the mark
        const length = parseNewlineOnly(input.substring(index));
        if (length) {
          return fallback(input);
        }
        if (char === '!') {
          state = processState.END;
          continue;
        } else {
          buffer += char;
        }
        break;
      }
      case processState.END: {
        index++;
        // empty media is treated as normal text
        if (buffer.length === 0) {
          return fallback(input);
        }

        /**
         * If the closing symbol is followed by a alphanumeric, it's
         * not a valid formatter, and we keep looking for
         * next valid closing formatter
         */
        if (index < input.length) {
          const charAfterEnd = input.charAt(index);
          if (/[a-zA-Z0-9]|[^\u0000-\u007F]/.test(charAfterEnd)) {
            buffer += char;
            state = processState.BUFFER;
            continue;
          }
        }
        /**
         * If the closing symbol has an empty space before it,
         * it's not a valid formatter, and we keep looking for
         * next valid closing formatter
         */
        if (buffer.endsWith(' ')) {
          buffer += char;
          state = processState.BUFFER;
          continue;
        }

        // !image.gif|align=right, vspace=4|ignore-this!
        // If it splits into more than 2 items, we ignore the rest
        const [rawContent, rawAttrs = ''] = buffer.split('|');

        const node = getMediaSingleNodeView(
          schema,
          rawContent,
          parseAttrs(rawAttrs, ','),
        );

        return {
          type: 'pmnode',
          nodes: [node],
          length: index,
        };
      }
      default:
    }
    index++;
  }
  return fallback(input);
}

function fallback(input: string): Token {
  return {
    type: 'text',
    text: input.substr(0, 1),
    length: 1,
  };
}
