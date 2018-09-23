import { Node as PMNode, Schema } from 'prosemirror-model';
import { getEditorColor } from '../color';
import { parseString } from '../text';
import { TokenType, TokenErrCallback } from '../tokenize';
import { hasAnyOfMarks } from '../utils/text';

export function colorMacro(
  attrs: { [key: string]: string },
  rawContent: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): PMNode[] {
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
  ];

  const content = parseString(
    rawContent,
    schema,
    ignoreTokenTypes,
    tokenErrCallback,
  );
  const decoratedContent = content.map(n => {
    const mark = schema.marks.textColor.create({
      color: getEditorColor(attrs) || '#000000',
    });

    // We don't want to mix `code` mark with others
    if (n.type.name === 'text' && !hasAnyOfMarks(n, ['textColor', 'code'])) {
      return n.mark([...n.marks, mark]);
    }
    return n;
  });

  return decoratedContent;
}
