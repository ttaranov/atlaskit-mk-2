import { Search, UnorderedSearchIndex, ITokenizer } from 'js-search';
import {
  HighlightDetail,
  MentionDescription,
  MentionsResult,
  isSpecialMention,
} from '../types';
import * as XRegExp from 'xregexp/src/xregexp'; // Not using 'xregexp' directly to only include what we use
import * as XRegExpUnicodeBase from 'xregexp/src/addons/unicode-base';
import * as XRegExpUnicodeScripts from 'xregexp/src/addons/unicode-scripts';
import * as XRegExpUnicodeCategories from 'xregexp/src/addons/unicode-categories';

XRegExpUnicodeBase(XRegExp);
XRegExpUnicodeScripts(XRegExp);
XRegExpUnicodeCategories(XRegExp);

// \p{Han} => each chinese character is a separate token
// \p{L}+[\p{Mn}|']*\p{L} => consecutive letters, including non spacing mark and apostrophe are a single token
const tokenizerRegex = XRegExp.cache(
  "\\p{Han}|\\p{L}+[\\p{Mn}|']*\\p{L}*",
  'gi',
);
const nonSpacingMarkRegex = XRegExp.cache('\\p{Mn}', 'gi');

// Order by increasing weight, using a big enough number to put item without an explicit weight
// at the end
const DEFAULT_WEIGHT = 100000;

export type Token = {
  token: string;
  start: number;
};

export class Tokenizer implements ITokenizer {
  public static tokenize(text): string[] {
    return this.tokenizeAsTokens(text).map(token => token.token);
  }

  public static tokenizeAsTokens(text): Token[] {
    let match;
    let tokens: Token[] = [];
    tokenizerRegex.lastIndex = 0;
    while ((match = tokenizerRegex.exec(text)) !== null) {
      if (match[0]) {
        tokens.push({
          token: match[0],
          start: match.index,
        });
      }
    }

    return tokens;
  }
}

/**
 * Returns a comparator function for MentionDescription object.
 *
 * @param {Set<string>} inContextUsers
 * @returns {(a: MentionDescription, b: MentionDescription) => number}
 */
export function mentionDescriptionComparator(inContextUsers: Set<string>) {
  return (a: MentionDescription, b: MentionDescription) => {
    let aIsSpecialMention = isSpecialMention(a);
    let bIsSpecialMention = isSpecialMention(b);
    if (aIsSpecialMention && !bIsSpecialMention) {
      return -1;
    }

    if (bIsSpecialMention && !aIsSpecialMention) {
      return 1;
    }

    const aInContext = inContextUsers.has(a.id);
    const bInContext = inContextUsers.has(b.id);
    if (aInContext && !bInContext) {
      return -1;
    }

    if (bInContext && !aInContext) {
      return 1;
    }

    const aWeight = a.weight !== undefined ? a.weight : DEFAULT_WEIGHT;
    const bWeight = b.weight !== undefined ? b.weight : DEFAULT_WEIGHT;
    if (aWeight !== bWeight) {
      return aWeight - bWeight;
    }

    if (a.name && b.name) {
      return a.name.localeCompare(b.name);
    }

    return a.id.localeCompare(b.id);
  };
}

export class Highlighter {
  public static find(field: string, query: string): HighlightDetail[] {
    const highlights: HighlightDetail[] = [];
    if (field) {
      const queryTokens = Tokenizer.tokenizeAsTokens(query.toLowerCase());
      queryTokens.sort((a, b) => -1 * a.token.localeCompare(b.token));

      const lowercaseField = field.toLowerCase();
      const fieldTokens: Token[] = Tokenizer.tokenizeAsTokens(lowercaseField);
      for (let fieldToken of fieldTokens) {
        for (let queryToken of queryTokens) {
          if (fieldToken.token.indexOf(queryToken.token) === 0) {
            const start = fieldToken.start;

            let end = start + queryToken.token.length - 1;
            let i = end + 1;
            let combiningCharacters = 0;

            // Includes non spacing mark in highlights (e.g. ញុំ  when searching ញ)
            while (
              i < fieldToken.token.length &&
              nonSpacingMarkRegex.test(fieldToken.token[i])
            ) {
              ++combiningCharacters;
              ++i;
              nonSpacingMarkRegex.lastIndex = 0;
            }

            highlights.push({
              start: start,
              end: end + combiningCharacters,
            });
            break;
          }
        }
      }

      if (highlights.length < queryTokens.length) {
        return [];
      }
    }

    return highlights;
  }
}

export class SearchIndex {
  private index: Search | null;
  private indexedCount: number;

  constructor() {
    this.reset();
  }

  public search(query: string = ''): Promise<MentionsResult> {
    return new Promise(resolve => {
      const localResults = this.index
        .search(query)
        .map(mention => {
          return {
            ...mention,
            highlight: {
              name: Highlighter.find(mention.name, query),
              mentionName: Highlighter.find(mention.mentionName, query),
              nickname: Highlighter.find(mention.nickname, query),
            },
          };
        })
        .filter(mention => {
          if (
            isSpecialMention(mention) &&
            mention.highlight.nickname.length === 0
          ) {
            return false;
          }

          return true;
        });

      resolve({
        mentions: localResults,
        query,
      });
    });
  }

  public hasDocuments() {
    return this.indexedCount > 0;
  }

  public reset() {
    this.index = SearchIndex.createIndex();
    this.indexedCount = 0;
  }

  public indexResults(mentions: MentionDescription[]) {
    this.index.addDocuments(mentions);
    this.indexedCount += mentions.length;
  }

  private static createIndex(): Search {
    const index = new Search('id');

    index.searchIndex = new UnorderedSearchIndex();
    index.tokenizer = Tokenizer;

    index.addIndex('name');
    index.addIndex('mentionName');
    index.addIndex('nickname');

    return index;
  }
}
