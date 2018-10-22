import { Node as PMNode, Schema } from 'prosemirror-model';
import { Token, TokenType, TokenErrCallback } from './';
import { commonFormatter } from './common-formatter';
import { parseString } from '../text';

export function monospace(
  input: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
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
  /** Add code mark to each text */
  const contentDecorator = (n: PMNode) => {
    const mark = schema.marks.code.create();
    // We don't want to mix `code` mark with others
    if (n.type.name === 'text' && n.marks.length) {
      return n;
    }
    return n.mark([mark]);
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
    opening: '{{',
    closing: '}}',
    rawContentProcessor,
  });
}
