import { doc, p, emoji } from '@atlaskit/editor-test-helpers';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('standard emojis', () => {
    const WIKI_NOTATION = `just an smiley face :) and another one :-( and finally :D`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'just an smiley face ',
          emoji({ shortName: ':slight_smile:' })(),
          ' and another one ',
          emoji({ shortName: ':disappointed:' })(),
          ' and finally ',
          emoji({ shortName: ':smiley:' })(),
        ),
      ),
    );
  });

  describe('standard emojis multiline', () => {
    const WIKI_NOTATION = `some smiley faces here:\\n\\n:-)\\n\\n:-(\\n\\n:)\\n\\n;-)\\n\\n:D\\n\\n:P\\n\\n:p`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('some smiley faces here:'),
        p(emoji({ shortName: ':slight_smile:' })()),
        p(emoji({ shortName: ':disappointed:' })()),
        p(emoji({ shortName: ':slight_smile:' })()),
        p(emoji({ shortName: ':wink:' })()),
        p(emoji({ shortName: ':stuck_out_tongue:' })()),
        p(emoji({ shortName: ':stuck_out_tongue:' })()),
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
          emoji({ shortName: ':warning:' })(),
          ' Warning',
          emoji({ shortName: ':warning:' })(),
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
      doc(p(emoji({ shortName: ':information_source:' })(), '&nbsp;')),
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

  describe('non emoji escaped bracket', () => {
    const WIKI_NOTATION = `\\(-)`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('&#40;-)')),
    );
  });
});
