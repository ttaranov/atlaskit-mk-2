import { Node as PMNode, Schema } from 'prosemirror-model';
import { Token, TokenType, TokenErrCallback } from './';
import { hasAnyOfMarks } from '../utils/text';
import { commonFormatter } from './common-formatter';
import { parseString } from '../text';

export function inserted(
  input: string,
  schema: Schema,
  tokenErrCallback: TokenErrCallback,
): Token {
  /**
   * The following token types will be ignored in parsing
   * the content
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
  ];
  /** Add underline mark to each text */
  const contentDecorator = (n: PMNode) => {
    const mark = schema.marks.underline.create();
    // We don't want to mix `code` mark with others
    if (n.type.name === 'text' && !hasAnyOfMarks(n, ['underline', 'code'])) {
      return n.mark([...n.marks, mark]);
    }
    return n;
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
    opening: '+',
    closing: '+',
    rawContentProcessor,
  });
}
