import { Node as PMNode, Schema } from 'prosemirror-model';
import { createTextNode } from './nodes/text';
import { parseToken, TokenType } from './tokenize';
import { parseKeyword, parseLeadingKeyword } from './tokenize/keyword';
import { parseWhitespaceOnly } from './tokenize/whitespace';

const processState = {
  NEWLINE: 0,
  BUFFER: 1,
  TOKEN: 2,
  ESCAPE: 3,
};

export function parseString(
  input: string,
  schema: Schema,
  ignoreTokens: TokenType[] = [],
): PMNode[] {
  let index = 0;
  let state = processState.NEWLINE;
  let buffer = '';
  let tokenType = TokenType.STRING;
  const output: PMNode[] = [];

  while (index < input.length) {
    const char = input.charAt(index);

    switch (state) {
      case processState.NEWLINE: {
        /**
         * During this state, the parser will trim leading
         * spaces and looking for any leading keywords.
         */
        const substring = input.substring(index);
        const length = parseWhitespaceOnly(substring);
        if (length) {
          index += length;
          continue;
        }

        const match = parseLeadingKeyword(substring) || parseKeyword(substring);

        if (match && ignoreTokens.indexOf(match.type) === -1) {
          tokenType = match.type;
          state = processState.TOKEN;
          continue;
        } else {
          state = processState.BUFFER;
          continue;
        }
      }

      case processState.BUFFER: {
        /**
         * During this state, the parser will start
         * saving plantext into the buffer until it hits
         * a keyword
         */
        const match = parseKeyword(input.substring(index));

        if (match) {
          tokenType = match.type;
          state = processState.TOKEN;
          continue;
        }

        if (char === '\\') {
          state = processState.ESCAPE;
          break;
        }

        buffer += char;
        break;
      }

      case processState.TOKEN: {
        const token = parseToken(input.substring(index), tokenType, schema);
        if (token.type === 'text') {
          buffer += token.text;
        } else if (token.type === 'pmnode') {
          output.push(...createTextNode(buffer, schema));
          buffer = ''; // clear the buffer
          output.push(...token.nodes);
        }
        index += token.length;
        if (tokenType === TokenType.HARD_BREAK) {
          state = processState.NEWLINE;
        } else {
          state = processState.BUFFER;
        }
        continue;
      }

      case processState.ESCAPE: {
        /**
         * During this state, the parser will see if the escaped
         * char is a keyword. If it's not a valid keyword, the '\'
         * will be included in the buffer as well
         */
        if (char === '\\') {
          // '\\' is a linebreak
          buffer += '\n';
          state = processState.BUFFER;
          break;
        }

        const match =
          parseLeadingKeyword(input.substring(index)) ||
          parseKeyword(input.substring(index));

        if (!match) {
          buffer += '\\';
        }
        buffer += char;
        state = processState.BUFFER;
        break;
      }
      default:
    }
    index++;
  }

  if (buffer.length > 0) {
    // Wrapping the rest of the buffer into a text node
    output.push(...createTextNode(buffer, schema));
  }

  return output;
}
