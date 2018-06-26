import { Node as PMNode, Schema } from 'prosemirror-model';
import { getType as getListType, ListBuilder } from '../builder/list-builder';
import { parseString } from '../text';
import { normalizePMNodes } from '../utils/normalize';
import { Token, TokenType } from './';
import { parseNewlineOnly } from './whitespace';

const LIST_ITEM_REGEXP = /^([*\-#]+)\s(.*)/;
const NEWLINE = /\r?\n/;

export function list(input: string, schema: Schema): Token {
  let index = 0;
  const output: PMNode[] = [];

  /**
   * The following token types will be ignored in parsing
   * the content of a strong mark
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.LIST,
    TokenType.RULER,
  ];

  let builder: ListBuilder | null = null;
  for (const line of input.split(NEWLINE)) {
    const match = line.match(LIST_ITEM_REGEXP);

    if (!match) {
      break;
    }

    const [, style, rawContent] = match;

    if (!builder) {
      builder = new ListBuilder(schema, style);
    }

    const type = getListType(style);
    // If it's top level and doesn't match, create a new list
    if (type !== builder.type && style.length === 1) {
      output.push(builder.buildPMNode());
      builder = new ListBuilder(schema, style);
    }

    const content = parseString(rawContent, schema, ignoreTokenTypes);
    const normalizedContent = normalizePMNodes(content, schema);

    builder.add([{ style, content: sanitize(normalizedContent, schema) }]);

    index += line.length;
    // Finding the length of the line break
    const lengthOfLineBreak = parseNewlineOnly(input.substring(index));
    if (lengthOfLineBreak) {
      index += lengthOfLineBreak;
    }
  }

  if (builder) {
    output.push(builder.buildPMNode());
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
