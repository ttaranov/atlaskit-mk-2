import { TokenType } from './';
import { EMOJIS } from './emoji';

/**
 * What's special about these keyword is that it follows following rules.
 *
 * "!file.jpg!" = should be converted to special formatting, there is no text before formatting char "!"
 * "Hello !file.jpg!" = should be converted to special formatting, there is no text before formatting char "!"
 * "?? hello?? = should not be converted to special formatting, there is a space after the "??" formatting characters
 * "text_foo_" = should not be converted to special formatting, there is text before formatting char "_"
 *
 */
const formatterKeywordTokenMap = {
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
  '??': TokenType.CITATION,
};

const macroKeywordTokenMap = {
  '{': TokenType.MACRO,
};

/**
 * The order of this mapping determind which keyword
 * will be checked first, so it matters.
 */
const keywordTokenMap = {
  '[~': TokenType.MENTION,
  '[^': TokenType.FLIE_LINK,
  '[': TokenType.LINK_FORMAT,
  http: TokenType.LINK_TEXT,
  irc: TokenType.LINK_TEXT,
  '\\\\': TokenType.HARD_BREAK,
  '\r': TokenType.HARD_BREAK,
  '\n': TokenType.HARD_BREAK,
  '\r\n': TokenType.HARD_BREAK,
};

export function parseFormatterKeyword(input: string) {
  for (const name in formatterKeywordTokenMap) {
    if (
      formatterKeywordTokenMap.hasOwnProperty(name) &&
      input.startsWith(name)
    ) {
      return {
        type: formatterKeywordTokenMap[name],
      };
    }
  }

  return null;
}

export function parseMacroKeyword(input: string) {
  for (const name in macroKeywordTokenMap) {
    if (macroKeywordTokenMap.hasOwnProperty(name) && input.startsWith(name)) {
      return {
        type: macroKeywordTokenMap[name],
      };
    }
  }

  return null;
}

export function parseOtherKeyword(input: string) {
  for (const name in keywordTokenMap) {
    if (keywordTokenMap.hasOwnProperty(name) && input.startsWith(name)) {
      return {
        type: keywordTokenMap[name],
      };
    }
  }

  // Look for a emoji
  const char = input.charAt(0);
  if ([':', '(', ';'].indexOf(char) !== -1) {
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
    regex: /^bq\. /,
  },
  {
    type: TokenType.HEADING,
    regex: /^h[1|2|3|4|5|6]\. /,
  },
  {
    type: TokenType.RULER,
    regex: /^-{4}\s/,
  },
  {
    type: TokenType.TRIPLE_DASH_SYMBOL,
    regex: /^-{3}\s/,
  },
  {
    type: TokenType.DOUBLE_DASH_SYMBOL,
    regex: /^-{2}\s/,
  },
  {
    type: TokenType.LIST,
    regex: /^[*\-#]+ /,
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
