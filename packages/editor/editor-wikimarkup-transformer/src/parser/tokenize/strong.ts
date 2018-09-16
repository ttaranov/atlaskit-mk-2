import { Node as PMNode, Schema } from 'prosemirror-model';
import { Token, TokenType } from './';
import { hasAnyOfMarks } from '../utils/text';
import { commonFormatter } from './common-formatter';

export function strong(input: string, schema: Schema): Token {
  /**
   * The following token types will be ignored in parsing
   * the content of a strong mark
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
  ];
  /** Adding strong mark to all text */
  const contentDecorator = (pmNode: PMNode) => {
    const mark = schema.marks.strong.create();
    // We don't want to mix `code` mark with others
    if (
      pmNode.type.name === 'text' &&
      !hasAnyOfMarks(pmNode, ['strong', 'code'])
    ) {
      return pmNode.mark([...pmNode.marks, mark]);
    }
    return pmNode;
  };

  return commonFormatter(input, schema, {
    opening: '*',
    closing: '*',
    ignoreTokenTypes,
    contentDecorator,
  });
}
