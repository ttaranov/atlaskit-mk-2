import { Node as PMNode, Schema } from 'prosemirror-model';
import { AddCellArgs } from '../../interfaces';
import { TableBuilder } from '../builder/table-builder';
import { parseString } from '../text';
import { isNextLineEmpty, normalizePMNodes } from '../utils/normalize';
import { Token, TokenType } from './';
import { parseNewlineOnly } from './whitespace';

const TABLE_REGEXP = /^\s*[|]+(.*)/;
const NEWLINE = /\r?\n/;

export function table(input: string, schema: Schema): Token {
  let index = 0;
  const output: PMNode[] = [];

  let builder: TableBuilder | null = null;
  let lineBuffer: string[] = [];
  for (const line of input.split(NEWLINE)) {
    const match = line.match(TABLE_REGEXP);

    if (!match && !isNextLineEmpty(input.substring(index))) {
      lineBuffer.push(line);
      index += line.length;
      // Finding the length of the line break
      const length = parseNewlineOnly(input.substring(index));
      if (length) {
        index += length;
      }
      continue;
    }

    if (!builder) {
      builder = new TableBuilder(schema);
    }

    if (lineBuffer.length > 0) {
      builder.add(parseToTableCell(lineBuffer.join('\n'), schema));
      lineBuffer = [];
    }

    if (isNextLineEmpty(input.substring(index))) {
      break;
    }

    lineBuffer.push(line);
    index += line.length;
    // Finding the length of the line break
    const lengthOfLineBreak = parseNewlineOnly(input.substring(index));
    if (lengthOfLineBreak) {
      index += lengthOfLineBreak;
    }
  }

  if (lineBuffer.length > 0 && builder) {
    builder.add(parseToTableCell(lineBuffer.join('\n'), schema));
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

function parseToTableCell(input: string, schema: Schema): AddCellArgs[] {
  /**
   * The following token types will be ignored in parsing
   * the content of a strong mark
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.TABLE,
    TokenType.RULER,
  ];

  const cells: AddCellArgs[] = [];
  let match;

  // E.g. || foo || bar -> [ "|| foo", "||", "foo" ] (invoke multiple times with .exec)
  const tableCellRegexp = /([|]+)([^|]+)/g;

  // tslint:disable-next-line:no-conditional-assignment
  while ((match = tableCellRegexp.exec(input)) !== null) {
    const [, /* discard */ style, rawContent] = match;
    const contentNode = parseString(rawContent, schema, ignoreTokenTypes);

    cells.push({ style, content: normalizePMNodes(contentNode, schema) });
  }

  return cells;
}
