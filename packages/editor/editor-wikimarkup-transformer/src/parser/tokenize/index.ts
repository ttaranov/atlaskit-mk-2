import { Node as PMNode, Schema } from 'prosemirror-model';
import { attachment } from './attachment';
import { blockquote } from './blockquote';
import { citation } from './citation';
import { deleted } from './deleted';
import { doubleDashSymbol } from './double-dash-symbol';
import { emoji } from './emoji';
import { emphasis } from './emphasis';
import { hardbreak } from './hardbreak';
import { heading } from './heading';
import { inserted } from './inserted';
import { linkFormat } from './link-format';
import { linkText } from './link-text';
import { list } from './list';
import { macro } from './macro';
import { mention } from './mention';
import { monospace } from './monospace';
import { quadrupleDashSymbol } from './quadruple-dash-symbol';
import { ruler } from './ruler';
import { strong } from './strong';
import { subscript } from './subscript';
import { superscript } from './superscript';
import { table } from './table';
import { tripleDashSymbol } from './triple-dash-symbol';

export enum TokenType {
  MACRO,
  PANEL,
  QUOTE,
  CODE,
  NOFORMAT,
  COLOR,
  STRING,
  LINK_FORMAT,
  LINK_TEXT,
  ATTACHMENT,
  HEADING,
  LIST,
  TABLE,
  RULER,
  HARD_BREAK, // \\, \r, \n, \r\n
  DOUBLE_DASH_SYMBOL, // --
  TRIPLE_DASH_SYMBOL, // ---
  QUADRUPLE_DASH_SYMBOL, // ----
  STRONG, // *strong*
  MONOSPACE, // {{text}}
  SUPERSCRIPT, // ^superscript^
  SUBSCRIPT, // ^subscript^
  EMPHASIS, // _emphasis_
  CITATION, // ??citation??
  DELETED, // -deleted-
  INSERTED, // +deleted+
  EMOJI, // :)
  MENTION, // [~username]
}

export interface TextToken {
  type: 'text';
  text: string;
  length: number;
}

export interface PMNodeToken {
  type: 'pmnode';
  nodes: PMNode[];
  length: number;
}

export type Token = TextToken | PMNodeToken;
export type TokenParser = (input: string, schema: Schema) => Token;

const tokenToTokenParserMapping: {
  [key: number]: TokenParser;
} = {
  [TokenType.DOUBLE_DASH_SYMBOL]: doubleDashSymbol,
  [TokenType.TRIPLE_DASH_SYMBOL]: tripleDashSymbol,
  [TokenType.QUADRUPLE_DASH_SYMBOL]: quadrupleDashSymbol,
  [TokenType.RULER]: ruler,
  [TokenType.STRONG]: strong,
  [TokenType.MONOSPACE]: monospace,
  [TokenType.SUPERSCRIPT]: superscript,
  [TokenType.SUBSCRIPT]: subscript,
  [TokenType.EMPHASIS]: emphasis,
  [TokenType.CITATION]: citation,
  [TokenType.DELETED]: deleted,
  [TokenType.INSERTED]: inserted,
  [TokenType.HARD_BREAK]: hardbreak,
  [TokenType.LINK_FORMAT]: linkFormat,
  [TokenType.LINK_TEXT]: linkText,
  [TokenType.HEADING]: heading,
  [TokenType.ATTACHMENT]: attachment,
  [TokenType.LIST]: list,
  [TokenType.QUOTE]: blockquote,
  [TokenType.TABLE]: table,
  [TokenType.EMOJI]: emoji,
  [TokenType.MENTION]: mention,
  [TokenType.MACRO]: macro,
};

export function parseToken(
  input: string,
  type: TokenType,
  schema: Schema,
): Token {
  const tokenParser = tokenToTokenParserMapping[type];
  if (tokenParser) {
    try {
      return tokenParser(input, schema);
    } catch (err) {
      return fallback(input);
    }
  }
  return fallback(input);
}

function fallback(input: string): Token {
  return {
    type: 'text',
    text: input.substr(0, 1),
    length: 1,
  };
}
