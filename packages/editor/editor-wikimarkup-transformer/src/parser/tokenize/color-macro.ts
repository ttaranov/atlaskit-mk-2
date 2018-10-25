import { Schema } from 'prosemirror-model';
import { Token, TokenType, TokenErrCallback } from '.';
import { commonMacro } from './common-macro';
import { parseAttrs } from '../utils/attrs';
import { parseString } from '../text';
import { getEditorColor } from '../color';
import { hasAnyOfMarks } from '../utils/text';

export function colorMacro(
  input: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token {
  return commonMacro(input, schema, {
    opening: /^\{color(?::([^\{\n\}]*))?\}/,
    closing: /\{color\}/,
    rawContentProcessor,
    tokenErrCallback,
  });
}

const rawContentProcessor = (
  rawAttrs: string,
  rawContent: string,
  length: number,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token => {
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
  ];

  const parsedAttrs = parseAttrs(rawAttrs);
  const content = parseString(
    rawContent,
    schema,
    ignoreTokenTypes,
    tokenErrCallback,
  );
  const decoratedContent = content.map(n => {
    const mark = schema.marks.textColor.create({
      color: getEditorColor(parsedAttrs) || '#000000',
    });

    // We don't want to mix `code` mark with others
    if (n.type.name === 'text' && !hasAnyOfMarks(n, ['textColor', 'code'])) {
      return n.mark([...n.marks, mark]);
    }
    return n;
  });

  return {
    type: 'pmnode',
    nodes: decoratedContent,
    length,
  };
};
