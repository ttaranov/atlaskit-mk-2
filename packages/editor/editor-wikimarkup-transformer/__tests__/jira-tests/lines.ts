import { doc, hardBreak, hr, p, strong } from '@atlaskit/editor-test-helpers';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';

// Nodes

describe('WikiMarkup Transformer', () => {
  describe('multiline', () => {
    const WIKI_NOTATION = `the first line
and the second one
finally the third!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'the first line',
          hardBreak(),
          'and the second one',
          hardBreak(),
          'finally the third!',
        ),
      ),
    );
  });

  describe('line terminator', () => {
    const WIKI_NOTATION = `the first line\\n   and the second one`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('the first line', hardBreak(), '   and the second one')),
    );
  });

  describe('line terminators with invisible whitespace', () => {
    const WIKI_NOTATION = `the first line\\n   second\\n   \\nand the third`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('the first line', hardBreak(), '   second'), p('and the third')),
    );
  });

  describe('bolded multiline', () => {
    const WIKI_NOTATION = `the first line\\n*bold line* here`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('the first line', hardBreak(), strong('bold line'), ' here')),
    );
  });

  describe('dashes', () => {
    let WIKI_NOTATION = `-------`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('-------')),
    );

    WIKI_NOTATION = 'a-----';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('a-----')),
    );

    WIKI_NOTATION = 'a ----- bb';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('a ----- bb')),
    );

    WIKI_NOTATION = 'a -----bb';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('a -----bb')),
    );

    WIKI_NOTATION = 'a ----bb';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('a ----bb')),
    );

    WIKI_NOTATION = '----';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(hr()),
    );

    WIKI_NOTATION = '-----';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(hr()),
    );
  });

  describe('line breaks', () => {
    const WIKI_NOTATION = `the first line
\\\\
\\\\
\\\\
\\\\
\\\\
and the second one
\\\\
\\\\
\\\\
finally the third!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'the first line',
          hardBreak(),
          hardBreak(),
          hardBreak(),
          hardBreak(),
          hardBreak(),
          hardBreak(),
          'and the second one',
          hardBreak(),
          hardBreak(),
          hardBreak(),
          hardBreak(),
          'finally the third!',
        ),
      ),
    );
  });
});
