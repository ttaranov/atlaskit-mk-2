import { Schema } from 'prosemirror-model';
import { Token } from './';
import { macro } from './macro';
import { linkFormat } from './link-format';
import { parseNewlineOnly } from './whitespace';

export interface FormatterOption {
  /** The opening symbol */
  opening: string;
  /** The closing symbol */
  closing: string;
  /** This function will be called with the rawContent */
  rawContentProcessor: (raw: string, length: number) => Token;
}

const processState = {
  START: 0,
  BUFFER: 1,
  END: 2,
  INLINE_MACRO: 3,
  LINK_FORMAT: 4,
};

export function commonFormatter(
  input: string,
  schema: Schema,
  opt: FormatterOption,
): Token {
  let index = 0;
  let state = processState.START;
  let buffer = '';

  while (index < input.length) {
    const char = input.charAt(index);
    const secChar = input.charAt(index + 1);
    const twoChar = input.substr(index, 2);

    switch (state) {
      case processState.START: {
        if (char !== opt.opening || secChar === ' ') {
          // this is not a valid formatter mark
          return fallback(input);
        }
        state = processState.BUFFER;
        break;
      }
      case processState.BUFFER: {
        // the linebreak would break the strong marks
        const length = parseNewlineOnly(input.substring(index));
        if (length) {
          return fallback(input);
        }
        if (char === opt.closing) {
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
        } else if (char === '[') {
          state = processState.LINK_FORMAT;
          continue;
        } else {
          buffer += char;
        }
        break;
      }
      case processState.END: {
        index++;
        // empty formatter mark is treated as normal text
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

        return opt.rawContentProcessor(buffer, index);
      }
      case processState.INLINE_MACRO: {
        const token = macro(input.substr(index), schema);
        if (token.type === 'text') {
          buffer += token.text;
          index += token.length;
          state = processState.BUFFER;
          continue;
        } else {
          // No macro are accepted in formater
          return fallback(input);
        }
      }
      case processState.LINK_FORMAT: {
        /**
         * We should "fly over" the link format and we dont want
         * -awesome [link|https://www.atlass-ian.com] nice
         * to be a strike through because of the '-' in link
         */
        const token = linkFormat(input.substr(index), schema);
        if (token.type === 'text') {
          buffer += token.text;
          index += token.length;
          state = processState.BUFFER;
          continue;
        } else if (token.type === 'pmnode') {
          buffer += input.substr(index, token.length);
          index += token.length;
          state = processState.BUFFER;
          continue;
        }
        return fallback(input);
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
