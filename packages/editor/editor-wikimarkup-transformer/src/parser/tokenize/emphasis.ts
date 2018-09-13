import { Node as PMNode, Schema } from 'prosemirror-model';
import { Token, TokenType } from './';
import { hasAnyOfMarks } from '../utils/text';
import { commonFormatter } from './common-formatter';

export function emphasis(input: string, schema: Schema): Token {
  /**
   * The following token types will be ignored in parsing
   * the content of a  mark
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
  ];
  /** Add underline mark to each text */
  const contentDecorator = (n: PMNode) => {
    const mark = schema.marks.em.create();
    // We don't want to mix `code` mark with others
    if (n.type.name === 'text' && !hasAnyOfMarks(n, ['em', 'code'])) {
      return n.mark([...n.marks, mark]);
    }
    return n;
  };

  return commonFormatter(input, schema, {
    opening: '_',
    closing: '_',
    ignoreTokenTypes,
    contentDecorator,
  });
}
