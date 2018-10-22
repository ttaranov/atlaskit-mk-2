import { Node as PMNode, Schema } from 'prosemirror-model';
import { AddCellArgs } from '../../interfaces';
import { TableBuilder } from '../builder/table-builder';
import { parseString } from '../text';
import { isNextLineEmpty, normalizePMNodes } from '../utils/normalize';
import { Token, TokenType, TokenErrCallback } from './';
import { parseNewlineOnly } from './whitespace';

const TABLE_REGEXP = /^\s*[|]+([^|\n]*)/;
const NEWLINE = /\r?\n/;

export function table(
  input: string,
  schema: Schema,
  tokenErrCallback: TokenErrCallback,
): Token {
  let index = 0;
  const output: PMNode[] = [];

  let builder: TableBuilder | null = null;
  let lineBuffer: string[] = [];
  for (const line of input.split(NEWLINE)) {
    const match = line.match(TABLE_REGEXP);

    if (!match && !isNextLineEmpty(line)) {
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
      builder.add(
        parseToTableCell(lineBuffer.join('\n'), schema, tokenErrCallback),
      );
      lineBuffer = [];
    }

    if (isNextLineEmpty(line)) {
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
    builder.add(
      parseToTableCell(lineBuffer.join('\n'), schema, tokenErrCallback),
    );
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

function parseToTableCell(
  input: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): AddCellArgs[] {
  /**
   * The following token types will be ignored in parsing
   * the content of a table cell
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.TABLE,
    TokenType.RULER,
  ];

  const cells: AddCellArgs[] = [];

  /**
   * If separator is a regular expression that contains capturing parentheses,
   * then each time separator is matched, the results (including any undefined results)
   * of the capturing parentheses are spliced into the output array.
   */
  const slices = input.split(/([|]+)/);
  /**
   * After the split, the first item would always be a "" which we don't need
   * For example,
   * ||header||header||header
   * returns:
   * ["", "||", "header", "||", "header", "||", "header"]
   */
  slices.shift();

  for (let i = 0; i < slices.length; i += 2) {
    const style = slices[i];
    const rawContent = i + 1 < slices.length ? slices[i + 1] : null;
    /**
     * We don't want to display the trailing space as a new cell
     * https://jdog.jira-dev.com/browse/BENTO-2319
     */
    if (rawContent === null || /^\s*$/.test(rawContent)) {
      continue;
    }

    const contentNode = parseString(
      rawContent,
      schema,
      ignoreTokenTypes,
      tokenErrCallback,
    );

    cells.push({ style, content: normalizePMNodes(contentNode, schema) });
  }

  return cells;
}
