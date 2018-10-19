import { isSafeUrl } from '@atlaskit/editor-common';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { parseString } from '../text';
import { Token, TokenType, TokenErrCallback } from './';
import { hasAnyOfMarks } from '../utils/text';

// [http://www.example.com] and [Example|http://www.example.com]
const LINK_FORMAT_REGEXP = /^\[(?:([^\]\n\|]*)\|)?([^\]\n]+)\]/;

export function linkFormat(
  input: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token {
  const output: PMNode[] = [];
  /**
   * The following token types will be ignored in parsing
   * the content
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.LINK_TEXT,
  ];

  const match = input.match(LINK_FORMAT_REGEXP);

  if (!match) {
    return fallback();
  }

  const textRepresentation = match[1] || match[2];
  const url = match[2];

  if (!isSafeUrl(url)) {
    return fallback();
  }

  const rawContent = parseString(
    textRepresentation.replace(/^mailto:/, ''),
    schema,
    ignoreTokenTypes,
    tokenErrCallback,
  );
  const decoratedContent = rawContent.map(n => {
    const mark = schema.marks.link.create({
      href: url,
    });
    // We don't want to mix `code` mark with others
    if (n.type.name === 'text' && !hasAnyOfMarks(n, ['link', 'code'])) {
      return n.mark([...n.marks, mark]);
    }
    return n;
  });

  output.push(...decoratedContent);
  if (!hasTextNode(rawContent)) {
    const mark = schema.marks.link.create({
      href: url,
    });
    const linkTextNode = schema.text(textRepresentation, [mark]);
    output.push(linkTextNode);
  }

  return {
    type: 'pmnode',
    nodes: output,
    length: match[0].length,
  };
}

function fallback(): Token {
  return {
    type: 'text',
    text: '[',
    length: 1,
  };
}

function hasTextNode(nodes: PMNode[]) {
  return nodes.find(n => {
    return n.type.name === 'text';
  });
}
