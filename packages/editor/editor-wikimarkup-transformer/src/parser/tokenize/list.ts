import { Node as PMNode, Schema } from 'prosemirror-model';
import { getType as getListType, ListBuilder } from '../builder/list-builder';
import { parseString } from '../text';
import { isNextLineEmpty, normalizePMNodes } from '../utils/normalize';
import { Token, TokenType, TokenErrCallback } from './';
import { parseNewlineOnly } from './whitespace';

const LIST_ITEM_REGEXP = /^ *([*\-#]+) (.*)/;
const NEWLINE = /\r?\n/;

export function list(
  input: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token {
  let index = 0;
  const output: PMNode[] = [];

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

  let builder: ListBuilder | null = null;
  let lineBuffer: string[] = [];
  let preStyle: string = '';
  for (const line of input.split(NEWLINE)) {
    const match = line.match(LIST_ITEM_REGEXP);

    if (match) {
      // This would be starting of a new list item
      const [, style, rawContent] = match;

      if (!builder) {
        // This is the first list item
        builder = new ListBuilder(schema, style);
      }

      if (lineBuffer.length > 0) {
        // Wrap up previous node and empty lineBuffer
        const content = parseString(
          lineBuffer.join('\n'),
          schema,
          ignoreTokenTypes,
          tokenErrCallback,
        );
        const normalizedContent = normalizePMNodes(content, schema);
        builder.add([
          { style: preStyle, content: sanitize(normalizedContent, schema) },
        ]);
        lineBuffer = [];
      }

      const type = getListType(style);
      preStyle = style;
      // If it's top level and doesn't match, create a new list
      if (type !== builder.type && style.length === 1) {
        output.push(...builder.buildPMNode());
        builder = new ListBuilder(schema, style);
      }

      lineBuffer.push(rawContent);
      index += line.length;
      // Finding the length of the line break at the end of this line
      const length = parseNewlineOnly(input.substring(index));
      if (length) {
        index += length;
      }
      continue;
    }

    if (!isNextLineEmpty(line)) {
      lineBuffer.push(line);
      index += line.length;
      // Finding the length of the line break at the end of this line
      const length = parseNewlineOnly(input.substring(index));
      if (length) {
        index += length;
      }
      continue;
    }

    /**
     * When we reach here, it means its an empty line,
     * so we would break out of the list builder
     */

    index += line.length;
    // Finding the length of the line break
    const lengthOfLineBreak = parseNewlineOnly(input.substring(index));
    if (lengthOfLineBreak) {
      index += lengthOfLineBreak;
    }
    break;
  }

  if (builder && lineBuffer.length > 0) {
    // Wrap up previous node and empty lineBuffer
    const content = parseString(
      lineBuffer.join('\n'),
      schema,
      ignoreTokenTypes,
      tokenErrCallback,
    );
    const normalizedContent = normalizePMNodes(content, schema);
    builder.add([
      { style: preStyle, content: sanitize(normalizedContent, schema) },
    ]);
  }
  if (builder) {
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
