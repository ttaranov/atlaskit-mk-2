import { Node as PMNode, Schema } from 'prosemirror-model';
import { getEditorColor } from '../color';
import { parseString } from '../text';
import { TokenType } from '../tokenize';

export function colorMacro(
  attrs: { [key: string]: string },
  rawContent: string,
  schema: Schema,
): PMNode[] {
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
  ];

  const content = parseString(rawContent, schema, ignoreTokenTypes);
  const decoratedContent = content.map(n => {
    const mark = schema.marks.textColor.create({
      color: getEditorColor(attrs),
    });

    if (n.type.name === 'text' && !hasColorMark(n)) {
      return n.mark([...n.marks, mark]);
    }
    return n;
  });

  return decoratedContent;
}

function hasColorMark(node: PMNode) {
  return node.marks.find(m => {
    return m.type.name === 'textColor';
  });
}
