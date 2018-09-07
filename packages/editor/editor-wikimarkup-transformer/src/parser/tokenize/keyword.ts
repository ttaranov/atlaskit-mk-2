import { TokenType } from './';
import { EMOJIS } from './emoji';

/**
 * The order of this mapping determind which keyword
 * will be checked first, so it matters.
 */
const keywordTokenMap = {
  '[~': TokenType.MENTION,
  '[': TokenType.LINK_FORMAT,
  http: TokenType.LINK_TEXT,
  irc: TokenType.LINK_TEXT,
  '!': TokenType.MEDIA,
  '----': TokenType.QUADRUPLE_DASH_SYMBOL,
  '---': TokenType.TRIPLE_DASH_SYMBOL,
  '--': TokenType.DOUBLE_DASH_SYMBOL,
  '-': TokenType.DELETED,
  '+': TokenType.INSERTED,
  '*': TokenType.STRONG,
  '^': TokenType.SUPERSCRIPT,
  '~': TokenType.SUBSCRIPT,
  _: TokenType.EMPHASIS,
  '{{': TokenType.MONOSPACE,
  '{': TokenType.MACRO,
  '??': TokenType.CITATION,
  '\\\\': TokenType.HARD_BREAK,
  '\r': TokenType.HARD_BREAK,
  '\n': TokenType.HARD_BREAK,
  '\r\n': TokenType.HARD_BREAK,
};

export function parseKeyword(input: string) {
  for (const name in keywordTokenMap) {
    if (keywordTokenMap.hasOwnProperty(name) && input.startsWith(name)) {
      return {
        type: keywordTokenMap[name],
      };
    }
  }

  // Look for a emoji
  if ([':', '(', ';'].indexOf(input.substr(0, 1)) !== -1) {
    for (const emoji of EMOJIS) {
      for (const text of emoji.markup) {
        if (input.startsWith(text)) {
          return {
            type: TokenType.EMOJI,
          };
        }
      }
    }
  }

  return null;
}

/**
 * These keywords only take effect when it's at the
 * beginning of the line
 * The order of the mapping matters. We should not put
 * LIST in front of RULER for example.
 */
// These keywords only take effect when it's at the
// beginning of the line
const leadingKeywordTokenMap = [
  {
    type: TokenType.QUOTE,
    regex: /^bq\.\s/,
  },
  {
    type: TokenType.HEADING,
    regex: /^h[1|2|3|4|5|6]\.\s/,
  },
  {
    type: TokenType.RULER,
    regex: /^-{4}/,
  },
  {
    type: TokenType.LIST,
    regex: /^[*\-#]+\s/,
  },
  {
    type: TokenType.TABLE,
    regex: /^\|{1,2}/,
  },
];

export function parseLeadingKeyword(input: string) {
  for (const keyword of leadingKeywordTokenMap) {
    if (keyword.regex.test(input)) {
      return {
        type: keyword.type,
      };
    }
  }

  return null;
}
