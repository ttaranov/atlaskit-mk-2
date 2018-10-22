import { Node as PMNode, Schema } from 'prosemirror-model';
import { Token, TokenType, TokenErrCallback } from './';
import { hasAnyOfMarks } from '../utils/text';
import { commonFormatter } from './common-formatter';
import { parseString } from '../text';

export function strong(
  input: string,
  schema: Schema,
  tokenErrCallback: TokenErrCallback,
): Token {
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

  const rawContentProcessor = (raw: string, length: number): Token => {
    const content = parseString(
      raw,
      schema,
      ignoreTokenTypes,
      tokenErrCallback,
    );
    const decoratedContent = content.map(contentDecorator);

    return {
      type: 'pmnode',
      nodes: decoratedContent,
      length,
    };
  };

  return commonFormatter(input, schema, {
    opening: '*',
    closing: '*',
    rawContentProcessor,
  });
}
