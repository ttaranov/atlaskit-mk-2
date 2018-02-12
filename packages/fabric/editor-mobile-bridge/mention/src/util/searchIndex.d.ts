import { ITokenizer } from 'js-search';
import { HighlightDetail, MentionDescription, MentionsResult } from '../types';
export declare type Token = {
  token: string;
  start: number;
};
export declare class Tokenizer implements ITokenizer {
  static tokenize(text: any): string[];
  static tokenizeAsTokens(text: any): Token[];
}
/**
 * Returns a comparator function for MentionDescription object.
 *
 * @param {Set<string>} inContextUsers
 * @returns {(a: MentionDescription, b: MentionDescription) => number}
 */
export declare function mentionDescriptionComparator(
  inContextUsers: Set<string>,
): (a: MentionDescription, b: MentionDescription) => number;
export declare class Highlighter {
  static find(field: string, query: string): HighlightDetail[];
}
export declare class SearchIndex {
  private index;
  private indexedCount;
  constructor();
  search(query?: string): Promise<MentionsResult>;
  hasDocuments(): boolean;
  reset(): void;
  indexResults(mentions: MentionDescription[]): void;
  private static createIndex();
}
