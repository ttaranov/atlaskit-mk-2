import { inputRules } from 'prosemirror-inputrules';
import { Node } from 'prosemirror-model';
import { EditorState, Transaction, Plugin, PluginKey } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EmojiProvider, EmojiDescription } from '@atlaskit/emoji';

import {
  createInputRule,
  leafNodeReplacementCharacter,
} from '../../../utils/input-rules';
import { isMarkTypeAllowedInCurrentSelection } from '../../../utils';

let matcher: AsciiEmojiMatcher;

export function inputRulePlugin(
  providerFactory?: ProviderFactory,
): Plugin | undefined {
  if (providerFactory) {
    initMatcher(providerFactory);
    const asciiEmojiRule = createInputRule(
      AsciiEmojiMatcher.REGEX,
      inputRuleHandler,
    );
    return inputRules({
      rules: [asciiEmojiRule],
    });
  }
}

function initMatcher(providerFactory: ProviderFactory) {
  const handleProvider = (name: string, provider?: Promise<EmojiProvider>) => {
    if (!provider) {
      return;
    }

    provider.then(emojiProvider => {
      emojiProvider.getAsciiMap().then(map => {
        matcher = new RecordingAsciiEmojiMatcher(emojiProvider, map);
      });
    });
  };

  providerFactory.subscribe('emojiProvider', handleProvider);
}

function inputRuleHandler(
  state: EditorState,
  matchParts: [string],
  start: number,
  end: number,
): Transaction | undefined {
  if (!matcher) {
    return undefined;
  }
  if (!isEnabled(state)) {
    return undefined;
  }

  const match = matcher.match(matchParts);
  if (match) {
    const transactionCreator = new AsciiEmojiTransactionCreator(
      state,
      match,
      start,
      end,
    );
    return transactionCreator.create();
  }
  return undefined;
}

function isEnabled(state: EditorState) {
  const emojiQuery = state.schema.marks.emojiQuery;
  const isEmojiQueryActive = state.selection.$from
    .marks()
    .some(mark => mark.type === emojiQuery);
  return (
    isEmojiQueryActive || isMarkTypeAllowedInCurrentSelection(emojiQuery, state)
  );
}

type AsciiEmojiMatch = {
  emoji: EmojiDescription;
  leadingString: string;
  trailingString: string;
};

const REGEX_LEADING_CAPTURE_INDEX = 1;
const REGEX_EMOJI_LEADING_PARENTHESES = 2;
const REGEX_EMOJI_ASCII_CAPTURE_INDEX = 3;
const REGEX_TRAILING_CAPTURE_INDEX = 4;

const getLeadingString = (
  match: string[],
  withParenthesis: boolean = true,
): string =>
  match[REGEX_LEADING_CAPTURE_INDEX] +
  (withParenthesis ? match[REGEX_EMOJI_LEADING_PARENTHESES] : '');

const getLeadingStringWithoutParentheses = (match: string[]): string =>
  getLeadingString(match, false);

const getAscii = (match: string[], withParentheses: boolean = false) =>
  (withParentheses ? match[REGEX_EMOJI_LEADING_PARENTHESES] : '') +
  match[REGEX_EMOJI_ASCII_CAPTURE_INDEX].trim();

const getAsciiWithParentheses = (matchParts: string[]): string =>
  getAscii(matchParts, true);

const getTrailingString = (match: string[]): string =>
  match[REGEX_TRAILING_CAPTURE_INDEX] || '';

class AsciiEmojiMatcher {
  /**
   * This regex matches 2 scenarios:
   * 1. an emoticon starting with a colon character (e.g. :D => 😃)
   * 2. an emoticon not starting with a colon character (e.g. 8-D => 😎)
   *
   * Explanation (${leafNodeReplacementCharacter} is replaced with character \ufffc)
   *
   *  1st Capturing Group ((?:^|[\s\ufffc])(?:\(*?))
   *    Non-capturing group (?:^|[\s\ufffc])
   *      1st Alternative ^
   *        ^ asserts position at start of the string
   *      2nd Alternative [\s\ufffc]
   *        matches a single character present in [\s\ufffc]
   *    Non-capturing group (?:\(*?)
   *      matches the character ( literally between zero and unlimited times, as few times as possible, expanding as needed (lazy)
   *  2nd Capturing Group (\(?)
   *    matches a single ( if present
   *  3rd Capturing Group ([^:\s\ufffc\(]\S{1,3}|:\S{1,3}( ))
   *    1st Alternative [^:\s\ufffc\(]\S{1,3}
   *      matches a single character not present in [^:\s\ufffc\(] between 1 and 3 times, as many times as possible, giving back as needed (greedy)
   *    2nd Alternative :\S{1,3}( )
   *      : matches the character : literally
   *      \S{1,3} matches any non-whitespace character between 1 and 3 times, as many times as possible, giving back as needed (greedy)
   *  4th Capturing Group ( )
   *
   * See https://regex101.com/r/HRS9O2/4
   */
  static REGEX = new RegExp(
    `((?:^|[\\s${leafNodeReplacementCharacter}])(?:\\(*?))(\\(?)([^:\\s${leafNodeReplacementCharacter}\\(]\\S{1,3}|:\\S{1,3}( ))$`,
  );

  private asciiToEmojiMap: Map<string, EmojiDescription>;

  constructor(asciiToEmojiMap: Map<string, EmojiDescription>) {
    this.asciiToEmojiMap = asciiToEmojiMap;
  }

  match(matchParts: string[]): AsciiEmojiMatch | undefined {
    return (
      this.getAsciiEmojiMatch(
        getLeadingStringWithoutParentheses(matchParts),
        getAsciiWithParentheses(matchParts),
        getTrailingString(matchParts),
      ) ||
      this.getAsciiEmojiMatch(
        getLeadingString(matchParts),
        getAscii(matchParts),
        getTrailingString(matchParts),
      )
    );
  }

  private getAsciiEmojiMatch(
    leading: string,
    ascii: string,
    trailing: string,
  ): AsciiEmojiMatch | undefined {
    const emoji = this.asciiToEmojiMap.get(ascii);
    return emoji
      ? {
          emoji,
          leadingString: leading,
          trailingString: trailing,
        }
      : undefined;
  }
}

/**
 * A matcher that will record ascii matches as usages of the matched emoji.
 */
class RecordingAsciiEmojiMatcher extends AsciiEmojiMatcher {
  private emojiProvider: EmojiProvider;

  constructor(
    emojiProvider: EmojiProvider,
    asciiToEmojiMap: Map<string, EmojiDescription>,
  ) {
    super(asciiToEmojiMap);
    this.emojiProvider = emojiProvider;
  }

  match(matchParts: string[]): AsciiEmojiMatch | undefined {
    const match = super.match(matchParts);
    if (match && this.emojiProvider.recordSelection) {
      this.emojiProvider.recordSelection(match.emoji);
    }

    return match;
  }
}

class AsciiEmojiTransactionCreator {
  private state: EditorState;
  private match: AsciiEmojiMatch;
  private start: number;
  private end: number;

  constructor(
    state: EditorState,
    match: AsciiEmojiMatch,
    start: number,
    end: number,
  ) {
    this.state = state;
    this.match = match;
    this.start = start;
    this.end = end;
  }

  create(): Transaction {
    return this.state.tr.replaceWith(this.from, this.to, this.createNodes());
  }

  private get from(): number {
    return this.start + this.match.leadingString.length;
  }

  private get to(): number {
    return this.end;
  }

  private createNodes(): Node[] {
    const nodes = [this.createEmojiNode()];
    if (this.trailingTextNodeRequired()) {
      nodes.push(this.createTrailingTextNode());
    }
    return nodes;
  }

  private createEmojiNode(): Node {
    const { emoji: emojiTypeNode } = this.state.schema.nodes;
    return emojiTypeNode.create(this.getEmojiNodeAttrs());
  }

  private getEmojiNodeAttrs() {
    const emoji = this.match.emoji;
    return {
      id: emoji.id,
      shortName: emoji.shortName,
      text: emoji.fallback || emoji.shortName,
    };
  }

  private trailingTextNodeRequired(): boolean {
    return this.match.trailingString.length > 0;
  }

  private createTrailingTextNode(): Node {
    return this.state.schema.text(this.match.trailingString);
  }
}

export const stateKey = new PluginKey('asciiEmojiPlugin');

const plugins = (providerFactory?: ProviderFactory) => {
  return [inputRulePlugin(providerFactory)].filter(
    plugin => !!plugin,
  ) as Plugin[];
};

export default plugins;
