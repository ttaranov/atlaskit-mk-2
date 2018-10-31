import { Node as PMNode, Schema } from 'prosemirror-model';
import { getType as getListType, ListBuilder } from '../builder/list-builder';
import { parseString } from '../text';
import { normalizePMNodes } from '../utils/normalize';
import { parseMacroKeyword } from './keyword';
import { Token, TokenType, TokenErrCallback, parseToken } from './';
import { parseNewlineOnly } from './whitespace';

const LIST_ITEM_REGEXP = /^ *([*\-#]+) /;
const EMPTY_LINE_REGEXP = /^[ \t]*\r?\n/;

const processState = {
  NEW_LINE: 0,
  BUFFER: 1,
  END: 2,
  MACRO: 3,
};

export function list(
  input: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token {
  /**
   * The following token types will be ignored in parsing
   * the content of a listItem
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.LIST,
    TokenType.RULER,
  ];

  let index = 0;
  let state = processState.NEW_LINE;
  let buffer = '';
  let lastListSymbols: string | null = null;
  let builder: ListBuilder | null = null;
  let contentBuffer: PMNode[] = [];
  const output: PMNode[] = [];

  while (index < input.length) {
    const char = input.charAt(index);

    switch (state) {
      case processState.NEW_LINE: {
        const substring = input.substring(index);
        const listMatch = substring.match(LIST_ITEM_REGEXP);
        if (listMatch) {
          const [, symbols] = listMatch;
          if (!builder) {
            /**
             * It happens because this is the first item of the list
             */
            builder = new ListBuilder(schema, symbols);
            lastListSymbols = symbols;
          } else {
            /**
             * There is a builder, so we are in the middle of building a list
             * and now there is a new list item
             */
            if (buffer.length > 0) {
              /** Wrap up previous list item and clear buffer */
              const content = parseString(
                buffer,
                schema,
                ignoreTokenTypes,
                tokenErrCallback,
              );
              const normalizedContent = normalizePMNodes(content, schema);
              contentBuffer.push(...normalizedContent);
              builder.add([
                {
                  style: lastListSymbols,
                  content: sanitize(contentBuffer, schema),
                },
              ]);
              buffer = '';
              contentBuffer = [];
            }

            /** We finished last list item here, going to the new one */
            lastListSymbols = symbols;
            const type = getListType(symbols);
            /** If it's top level and doesn't match, create a new list */
            if (type !== builder.type && symbols.length === 1) {
              output.push(...builder.buildPMNode());
              builder = new ListBuilder(schema, symbols);
            }
          }

          index += listMatch[0].length;
        }

        /**
         * If we encounter an empty line, we should end the list
         */
        const emptyLineMatch = substring.match(EMPTY_LINE_REGEXP);
        if (emptyLineMatch) {
          state = processState.END;
          continue;
        }

        state = processState.BUFFER;
        continue;
      }
      case processState.BUFFER: {
        const length = parseNewlineOnly(input.substring(index));
        if (length) {
          buffer += input.substr(index, length);
          state = processState.NEW_LINE;
          index += length;
          continue;
        }

        if (char === '{') {
          state = processState.MACRO;
          continue;
        } else {
          buffer += char;
        }
        break;
      }
      case processState.MACRO: {
        const match = parseMacroKeyword(input.substring(index));
        if (!match) {
          buffer += char;
          state = processState.BUFFER;
          break;
        }
        const token = parseToken(input.substring(index), match.type, schema);
        if (token.type === 'text') {
          buffer += token.text;
        } else {
          /**
           * We found a macro in the list...
           */
          if (!builder) {
            /** Something is really wrong here */
            return fallback(input);
          }
          if (buffer.length > 0) {
            /**
             * Wrapup what is already in the string buffer and save it to
             * contentBuffer
             */
            const content = parseString(
              buffer,
              schema,
              ignoreTokenTypes,
              tokenErrCallback,
            );
            const normalizedContent = normalizePMNodes(content, schema);
            contentBuffer.push(...sanitize(normalizedContent, schema));
            buffer = '';
          }

          const normalizedContent = normalizePMNodes(token.nodes, schema);
          contentBuffer.push(...sanitize(normalizedContent, schema));
        }
        index += token.length;
        state = processState.BUFFER;
        continue;
      }
      case processState.END: {
        if (!builder) {
          /** Something is really wrong here */
          return fallback(input);
        }

        if (buffer.length > 0) {
          /** Wrap up previous list item and clear buffer */
          const content = parseString(
            buffer,
            schema,
            ignoreTokenTypes,
            tokenErrCallback,
          );
          const normalizedContent = normalizePMNodes(content, schema);
          contentBuffer.push(...normalizedContent);
        }

        builder.add([
          { style: lastListSymbols, content: sanitize(contentBuffer, schema) },
        ]);
        output.push(...builder.buildPMNode());
        return {
          type: 'pmnode',
          nodes: output,
          length: index,
        };
      }
    }
    index++;
  }

  if (buffer.length > 0) {
    /** Wrap up what's left in the buffer */
    const content = parseString(
      buffer,
      schema,
      ignoreTokenTypes,
      tokenErrCallback,
    );
    const normalizedContent = normalizePMNodes(content, schema);
    contentBuffer.push(...normalizedContent);
  }

  if (builder) {
    builder.add([
      { style: lastListSymbols, content: sanitize(contentBuffer, schema) },
    ]);
    output.push(...builder.buildPMNode());
  }

  return {
    type: 'pmnode',
    nodes: output,
    length: index,
  };
}

function sanitize(nodes: PMNode[], schema: Schema) {
  return nodes.reduce((result: PMNode[], curr: PMNode) => {
    switch (curr.type.name) {
      case 'blockquote': {
        /**
         * If a blockquote is inside a list item
         * - Convert it to paragraph
         */
        curr.content.forEach(n => {
          result.push(n);
        });
        break;
      }
      case 'heading': {
        /**
         * If a heading is inside a list item
         * - Convert the heading to paragraph
         * - Convert text to upper case
         * - Mark text with strong.
         */
        const contentBuffer: PMNode[] = [];
        curr.content.forEach(n => {
          const mark = schema.marks.strong.create();
          if (n.type.name === 'text') {
            if (n.text) {
              n.text = n.text.toUpperCase();
            }
            contentBuffer.push(n.mark([...n.marks, mark]));
          } else {
            contentBuffer.push(n);
          }
        });
        const p = schema.nodes.paragraph.createChecked({}, contentBuffer);
        result.push(p);
        break;
      }
      default:
        result.push(curr);
    }
    return result;
  }, []);
}

function fallback(input: string): Token {
  return {
    type: 'text',
    text: input.substr(0, 1),
    length: length,
  };
}
