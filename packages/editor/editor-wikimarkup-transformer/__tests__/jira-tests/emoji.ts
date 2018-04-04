import { doc, p, emoji } from '@atlaskit/editor-test-helpers';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';
import { EMOJIS } from '../../src/parser/emoji';
import { EmojiMapItem } from '../../src/interfaces';

// Nodes

// @TODO markup as array
const findEmojiConfig = (markup: string) => {
  const [emoji] = EMOJIS.reduce((acc: any[], emoji: EmojiMapItem) => {
    if (emoji.markup.indexOf(markup) !== -1) {
      return [...acc, emoji.adf];
    }
    return acc;
  }, []);

  return emoji;
};

describe('WikiMarkup Transformer', () => {
  describe('standard emojis', () => {
    const WIKI_NOTATION = `just an smiley face :) and another one :-( and finally :D`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'just an smiley face ',
          emoji(findEmojiConfig(':)'))(),
          ' and another one ',
          emoji(findEmojiConfig(':-('))(),
          ' and finally ',
          emoji(findEmojiConfig(':D'))(),
        ),
      ),
    );
  });

  describe('standard emojis multiline', () => {
    const WIKI_NOTATION = `some smiley faces here:\n\n:-)\n\n:-(\n\n:)\n\n;-)\n\n:D\n\n:P\n\n:p`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('some smiley faces here:'),
        p(emoji(findEmojiConfig(':-)'))()),
        p(emoji(findEmojiConfig(':-('))()),
        p(emoji(findEmojiConfig(':)'))()),
        p(emoji(findEmojiConfig(';-)'))()),
        p(emoji(findEmojiConfig(':D'))()),
        p(emoji(findEmojiConfig(':P'))()),
        p(emoji(findEmojiConfig(':p'))()),
      ),
    );
  });

  describe('warning emoji', () => {
    const WIKI_NOTATION = `(!) Warning(!)`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          emoji(findEmojiConfig('(!)'))(),
          ' Warning',
          emoji(findEmojiConfig('(!)'))(),
        ),
      ),
    );
  });

  describe('info emoji', () => {
    const WIKI_NOTATION = `(i)&nbsp;`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(emoji(findEmojiConfig('(i)'))(), '&nbsp;')),
    );
  });

  describe('non emoji double quotes', () => {
    const WIKI_NOTATION = `(")`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('(")')),
    );
  });

  describe('non emoji single quotes', () => {
    const WIKI_NOTATION = `(')`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p("(')")),
    );
  });

  // @TODO Defect - not escaping this
  describe.skip('non emoji escaped bracket', () => {
    const WIKI_NOTATION = `\\(-)`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('&#40;-)')),
    );
  });
});
